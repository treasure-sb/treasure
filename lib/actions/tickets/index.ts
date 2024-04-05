"use server";

import createSupabaseServerClient from "@/utils/supabase/server";

const addEventAttendee = async (
  event_id: string,
  attendee_id: string,
  ticket_id: string,
  quantity: number
) => {
  const supabase = await createSupabaseServerClient();
  const ticketsToInsert = Array.from({ length: quantity }).map(() => {
    return { attendee_id, event_id, ticket_id };
  });
  const { data, error } = await supabase
    .from("event_tickets")
    .insert(ticketsToInsert)
    .select();
  return { data, error };
};

export { addEventAttendee };
