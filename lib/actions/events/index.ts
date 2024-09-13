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
import { CreateEvent } from "@/app/(create-event)/create/schema";
import format from "date-fns/format";

const updatedCreateEvent = async (values: CreateEvent) => {
  const supabase = await createSupabaseServerClient();

  const previousEventsCount = await getPreviousEventsCount(
    values.basicDetails.name,
    values.dates[0].date!
  );
  const cleanedEventName = cleanedEventUrlName(
    values.basicDetails.name,
    values.dates[0].date!,
    previousEventsCount
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("create_event", {
    event_data: values,
    cleaned_name: cleanedEventName,
    user_id: user!.id,
  });

  return { data, error };
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

  const previousEventsCount = await getPreviousEventsCount(
    name,
    date as Date,
    ""
  );
  const cleanedEventName = cleanedEventUrlName(
    name,
    date as Date,
    previousEventsCount
  );

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
        city,
        state,
        vendor_exclusivity,
        sales_status,
        poster_url,
        venue_map_url,
        max_date: date,
        min_date: date,
      },
    ])
    .select();

  if (data) {
    const event: Tables<"events"> = data[0];

    await supabase.from("event_roles").insert([
      {
        event_id: event.id,
        user_id: user!.id,
        role: "HOST",
        status: "ACTIVE",
      },
    ]);
    await createEventDate(event.id, date as Date, start_time, end_time);
    const eventPromises = [
      await createTickets(values.tickets, event.id),
      await createTableTicket(values.tables, event.id),
      await createApplicationInfo(
        values.application_vendor_information,
        event.id
      ),
      await createTags(values.tags, event.id),
    ];
    await Promise.allSettled(eventPromises);
  }
  if (!error) {
    redirect(`/events/${cleanedEventName}`);
  } else {
    return { error };
  }
};

const createTags = async (tags: EventFormTag[], event_id: string) => {
  const supabase = await createSupabaseServerClient();
  tags.forEach(async (tag) => {
    await supabase
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

  const { data } = await supabase
    .from("event_dates")
    .select("id")
    .eq("event_id", event_id);

  const eventDateId = data ? data[0].id : null;

  const ticketsPromise = tickets.map(async (ticket) => {
    const { ticket_price, ticket_quantity, ticket_name } = ticket;

    const { data: datatickets } = await supabase
      .from("tickets")
      .insert([
        {
          price: ticket_price,
          quantity: ticket_quantity,
          name: ticket_name,
          event_id,
        },
      ])
      .select("*")
      .single();

    const { data, error } = await supabase.from("ticket_dates").insert([
      {
        ticket_id: datatickets?.id,
        event_date_id: eventDateId,
      },
    ]);
  });

  await Promise.allSettled(ticketsPromise);
};

const createTableTicket = async (
  tables: EventFormTable[],
  event_id: string
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
      },
    ]);
  });
  await Promise.allSettled(tablesPromise);
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
  await supabase
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
    await supabase
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

const getAllEventCleanedNames = async () => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select("cleaned_name, created_at");
  return { data };
};

type EditEvent = {
  posterUrl: string;
  name: string;
  description: string;
  venueName: string;
  dates: EventDate[];
} & EventLocation;

type EventDate = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
};

type EventLocation = {
  address: string;
  lng: number;
  lat: number;
  city: string;
  state: string;
};

const updateEvent = async (editEventData: EditEvent, eventId: string) => {
  const supabase = await createSupabaseServerClient();
  const {
    name,
    posterUrl,
    description,
    venueName,
    address,
    lat,
    lng,
    city,
    state,
    dates,
  } = editEventData;

  const { maxDate, minDate } = dates.reduce(
    (acc, dates) => {
      return {
        maxDate: dates.date > acc.maxDate ? dates.date : acc.maxDate,
        minDate: dates.date < acc.minDate ? dates.date : acc.minDate,
      };
    },
    { maxDate: dates[0].date, minDate: dates[0].date }
  );

  try {
    const previousEventsCount = await getPreviousEventsCount(
      name,
      minDate,
      eventId
    );
    const cleanedEventName = cleanedEventUrlName(
      name,
      minDate,
      previousEventsCount
    );

    const { data: eventData, error: updateError } = await supabase
      .from("events")
      .update({
        name,
        description,
        address,
        lat,
        lng,
        city,
        state,
        cleaned_name: cleanedEventName,
        venue_name: venueName,
        poster_url: posterUrl,
        max_date: maxDate,
        min_date: minDate,
      })
      .eq("id", eventId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    const event: Tables<"events"> = eventData;

    const dateUpdatePromises = dates.map((date) =>
      editEventDate(date.id, date.date, date.startTime, date.endTime)
    );

    await Promise.all(dateUpdatePromises);

    return { success: true, error: null, data: event };
  } catch (error) {
    return { success: false, error, data: null };
  }
};

const createEventDate = async (
  eventId: string,
  date: Date,
  startTime: string,
  endTime: string
) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_dates").insert([
    {
      event_id: eventId,
      date,
      start_time: startTime,
      end_time: endTime,
    },
  ]);
  return { error };
};

const editEventDate = async (
  dateId: string,
  date: Date,
  startTime: string,
  endTime: string
) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("event_dates")
    .update({
      date,
      start_time: startTime,
      end_time: endTime,
    })
    .eq("id", dateId);
  return { error };
};

// Name: Event 1, Date: 08-24-2024 -> event-1-08242024
const cleanedEventUrlName = (
  eventName: string,
  eventDate: Date,
  previousEventsCount: number
) => {
  const cleanedDate = format(eventDate, "MMddyyyy");
  const cleanedName = eventName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return previousEventsCount == 0
    ? `${cleanedName}-${cleanedDate}`
    : `${cleanedName}-${cleanedDate}-${previousEventsCount}`;
};

const getPreviousEventsCount = async (
  eventName: string,
  eventDate: Date,
  eventId?: string
) => {
  const supabase = await createSupabaseServerClient();
  const formattedDate = format(eventDate, "yyyy-MM-dd");
  let query = supabase
    .from("events")
    .select("name")
    .eq("name", eventName)
    .eq("min_date", formattedDate);

  if (eventId) {
    query = query.neq("id", eventId);
  }

  const { data: eventsData } = await query;

  if (!eventsData || eventsData.length === 0) {
    return 0;
  }
  return eventsData.length + 1;
};

export {
  createEvent,
  likeEvent,
  unlikeEvent,
  getAllEventCleanedNames,
  updateEvent,
  getPreviousEventsCount,
  cleanedEventUrlName,
  updatedCreateEvent,
  type EditEvent,
  type EventLocation,
};
