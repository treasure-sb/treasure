"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  EventForm,
  EventFormTicket,
  EventFormTag,
  EventFormTable,
} from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  createTicketTailorEvent,
  createTicketTailorTickets,
  publishTicketTailorEvent,
  createTicketTailorEventOccurence,
} from "../ticket-tailor";
import format from "date-fns/format";
import EditEventForm from "@/app/profile/events/organizer/[id]/edit-event/EditEventForm";

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
    date,
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

  // Create table tickets in ticket tailor
  const table = [
    {
      ticket_name: "Table",
      ticket_price: values.tables[0].table_price,
      ticket_quantity: values.tables[0].table_quantity,
    },
  ] as EventFormTicket[];
  await createTicketTailorTickets(table, ticketTailorEventData.id);

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
        start_time,
        end_time,
        poster_url,
        venue_map_url,
        organizer_id: user?.id,
        ticket_tailor_event_id: ticketTailorEventData.id,
      },
    ])
    .select();
  if (data) {
    const event: Tables<"events"> = data[0];
    await createTickets(values.tickets, event.id);
    await createTableTicket(values.tables, event.id);
    await createTags(values.tags, event.id);
  }
  if (!error) {
    redirect("/profile");
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
    const { data: ticketsData, error } = await supabase
      .from("tickets")
      .insert([
        {
          price: ticket_price,
          quantity: ticket_quantity,
          name: ticket_name,
          event_id,
        },
      ])
      .select();
  });
};

const createTableTicket = async (
  tables: EventFormTable[],
  event_id: string
) => {
  const supabase = await createSupabaseServerClient();
  tables.forEach(async (table) => {
    const { table_price, table_quantity } = table;
    const { data: ticketsData, error } = await supabase
      .from("tickets")
      .insert([
        {
          price: table_price,
          quantity: table_quantity,
          name: "Table",
          event_id,
        },
      ])
      .select();
  });
};

export { createEvent };
