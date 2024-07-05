"use server";

import { roundPrice } from "@/lib/utils";
import createSupabaseServerClient from "@/utils/supabase/server";

type Ticket = {
  name: string;
  price: string;
  quantity: string;
  total_tickets: string;
  event_id?: string;
  id?: string;
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
    ...ticket,
    price: roundPrice(ticket.price),
  }));
  const { error } = await supabase.from("tickets").insert(roundedTickets);
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
        total_tickets: ticket.total_tickets,
      })
      .eq("id", ticket.id);

    if (error) {
      return { error };
    }
  }
  return { error: null };
};

export { addEventAttendee, createTickets, updateTickets, type Ticket };
