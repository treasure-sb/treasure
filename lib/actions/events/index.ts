"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  EventForm,
  EventFormTicket,
  EventFormTag,
  EventFormTable,
  EventVendorApplication,
} from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  createTicketTailorEvent,
  createTicketTailorTickets,
  publishTicketTailorEvent,
  createTicketTailorEventOccurence,
} from "../ticket-tailor";
import { createStripeProduct } from "../stripe";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import format from "date-fns/format";

// Normalize accented characters, remove special characters, replace spaces with hyphens, and convert to lowercase
const cleanedEventUrlName = (event_name: string, event_date: Date) => {
  const cleanedDate = format(event_date, "MMddyyyy");
  const cleanedName = event_name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return `${cleanedName}-${cleanedDate}`;
};

const checkPreviousEvents = async (event_name: string, event_date: Date) => {
  const supabase = await createSupabaseServerClient();
  const formattedDate = format(event_date, "yyyy-MM-dd");
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("name", event_name)
    .eq("date", formattedDate);
  if (!events || events.length === 0) {
    return 0;
  }
  return events.length + 1;
};

const createEvent = async (values: EventForm) => {
  const supabase = await createSupabaseServerClient();
  const {
    name,
    description,
    venue_name,
    address,
    lng,
    lat,
    city,
    state,
    date,
    table_public,
    vendor_exclusivity,
    sales_status,
    start_time,
    end_time,
    poster_url,
    venue_map_url,
  } = values;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // create event and tickets on ticket tailor and publish the event
  const ticketTailorEvent = {
    name,
    description,
    venue_name,
  };
  const ticketTailorEventData = await createTicketTailorEvent(
    ticketTailorEvent
  );

  const ticketTailorEventOccurence = {
    start_date: date?.toISOString().split("T")[0],
    end_date: date?.toISOString().split("T")[0],
    start_time: start_time + ":00",
    end_time: end_time + ":00",
  };

  await createTicketTailorEventOccurence(
    ticketTailorEventData.id,
    ticketTailorEventOccurence
  );
  await createTicketTailorTickets(values.tickets, ticketTailorEventData.id);

  await publishTicketTailorEvent(ticketTailorEventData.id);

  // check if there are previous events with the same name and same date
  const previousEvents = await checkPreviousEvents(name, date as Date);

  // create cleaned event name
  let cleanedEventName = cleanedEventUrlName(name, date as Date);
  if (previousEvents > 0) {
    cleanedEventName = `${cleanedEventName}-${previousEvents}`;
  }
  // create the event on supabase
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        name,
        cleaned_name: cleanedEventName,
        description,
        address,
        lng,
        venue_name,
        lat,
        date,
        city,
        state,
        start_time,
        end_time,
        table_public,
        vendor_exclusivity,
        sales_status,
        poster_url,
        venue_map_url,
        organizer_id: user?.id,
        ticket_tailor_event_id: ticketTailorEventData.id,
      },
    ])
    .select();
  if (data) {
    const event: Tables<"events"> = data[0];
    const posterUrl = await getPublicPosterUrl(event);
    await createTickets(values.tickets, event.id);
    await createTableTicket(values.tables, event.id, event.name, posterUrl);
    await createApplicationInfo(
      values.application_vendor_information,
      event.id
    );
    await createTags(values.tags, event.id);
  }
  if (!error) {
    redirect(`/events/${cleanedEventName}`);
  }
};

const createTags = async (tags: EventFormTag[], event_id: string) => {
  const supabase = await createSupabaseServerClient();
  tags.forEach(async (tag) => {
    const { data: tagsData, error } = await supabase
      .from("event_tags")
      .insert([
        {
          event_id,
          tag_id: tag.tag_id,
        },
      ])
      .select();
  });
};

const createTickets = async (tickets: EventFormTicket[], event_id: string) => {
  const supabase = await createSupabaseServerClient();
  tickets.forEach(async (ticket) => {
    const { ticket_price, ticket_quantity, ticket_name } = ticket;
    await supabase.from("tickets").insert([
      {
        price: ticket_price,
        quantity: ticket_quantity,
        name: ticket_name,
        event_id,
      },
    ]);
  });
};

const createTableTicket = async (
  tables: EventFormTable[],
  event_id: string,
  event_name: string,
  poster_url: string
) => {
  const supabase = await createSupabaseServerClient();
  const tablesPromise = tables.map(async (table) => {
    const {
      section_name,
      table_price,
      table_quantity,
      table_provided,
      space_allocated,
      number_vendors_allowed,
      additional_information,
    } = table;

    // create table ticket on stripe
    const tableTicketProduct = {
      name: `${event_name} Table: ${section_name}`,
      price: table_price,
      poster_url,
    };

    const stripeTableProduct = await createStripeProduct(tableTicketProduct);

    await supabase.from("tables").insert([
      {
        section_name,
        price: table_price,
        quantity: table_quantity,
        table_provided,
        space_allocated,
        number_vendors_allowed,
        additional_information,
        event_id,
        stripe_product_id: stripeTableProduct.id,
        stripe_price_id: stripeTableProduct.default_price,
      },
    ]);
  });
  await Promise.all(tablesPromise);
};

const createApplicationInfo = async (
  application_vendors_information: EventVendorApplication,
  event_id: string
) => {
  const supabase = await createSupabaseServerClient();
  const {
    check_in_time,
    check_in_location,
    wifi_availability,
    additional_information,
    terms,
  } = application_vendors_information;
  const { data: applicationInfo, error } = await supabase
    .from("application_vendor_information")
    .insert([
      {
        check_in_time,
        check_in_location,
        wifi_availability,
        additional_information,
        event_id,
      },
    ])
    .select();

  const termsPromise = terms.map(async (singleTerm) => {
    const { data: termsData, error: termsError } = await supabase
      .from("application_terms_and_conditions")
      .insert([{ event_id, term: singleTerm.term }])
      .select();
  });

  await Promise.all(termsPromise);
};

const likeEvent = async (event_id: string, user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("event_likes")
    .insert([
      {
        event_id,
        user_id,
      },
    ])
    .select();
  return { data, error };
};

const unlikeEvent = async (event_id: string, user_id: string) => {
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("event_likes")
    .delete()
    .eq("event_id", event_id)
    .eq("user_id", user_id);
};

export { createEvent, likeEvent, unlikeEvent };
