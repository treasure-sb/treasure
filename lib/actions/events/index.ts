"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import * as z from "zod";
import { redirect } from "next/navigation";
import { EventForm } from "@/types/event";

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
  } = values;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("events")
    .insert([
      {
        name,
        description,
        address,
        lng,
        venue_name,
        lat,
        date,
        start_time,
        end_time,
        poster_url,
        organizer_id: user?.id,
      },
    ])
    .select();
  if (data) {
    const event_id = data[0].id;
    await createTickets(values, event_id);
  }
  if (!error) {
    redirect("/profile");
  }
};

const createTickets = async (values: EventForm, event_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { ticket_price, ticket_quantity } = values;
  const { data, error } = await supabase.from("tickets").insert({
    event_id,
    price: ticket_price,
    quantity: ticket_quantity,
  });
};

export { createEvent };
