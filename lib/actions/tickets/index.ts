"use server";

import { roundPrice } from "@/lib/utils";
import createSupabaseServerClient from "@/utils/supabase/server";

type Ticket = {
  name: string;
  price: string;
  quantity: string;
  total_tickets?: string;
  event_id?: string;
  id?: string;
  ticket_dates: string[];
  description: string;
};

const addEventAttendee = async (
  event_id: string,
  attendee_id: string,
  ticket_id: string,
  quantity: number,
  email: string
) => {
  const supabase = await createSupabaseServerClient();
  const ticketsToInsert = Array.from({ length: quantity }).map(() => {
    return { attendee_id, event_id, ticket_id, email };
  });
  const { data, error } = await supabase
    .from("event_tickets")
    .insert(ticketsToInsert)
    .select();
  return { data, error };
};

const createTickets = async (tickets: Ticket[]) => {
  const supabase = await createSupabaseServerClient();
  const roundedTickets = tickets.map((ticket) => ({
    name: ticket.name,
    quantity: ticket.quantity,
    price: roundPrice(ticket.price),
    event_id: ticket.event_id,
    description: ticket.description === "" ? null : ticket.description,
    total_tickets: ticket.quantity,
    ticket_dates: ticket.ticket_dates,
  }));
  const { data, error } = await supabase.rpc("insert_multiple_tickets", {
    ticket_info_array: roundedTickets,
  });
  return { error };
};

const updateTickets = async (tickets: Ticket[]) => {
  const supabase = await createSupabaseServerClient();
  for (const ticket of tickets) {
    const { error } = await supabase
      .from("tickets")
      .update({
        price: roundPrice(ticket.price),
        quantity: ticket.quantity,
        name: ticket.name,
        total_tickets:
          parseInt(
            ticket.total_tickets === undefined ? "0" : ticket.total_tickets
          ) + ticket.quantity,
        description: ticket.description === "" ? null : ticket.description,
      })
      .eq("id", ticket.id);

    if (error) {
      return { error };
    }
  }
  return { error: null };
};

export { addEventAttendee, createTickets, updateTickets, type Ticket };
