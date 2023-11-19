"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import * as z from "zod";
import { eventFormSchema } from "@/lib/schemas/events";
import { redirect } from "next/navigation";

const createEvent = async (values: z.infer<typeof eventFormSchema>) => {
  const {
    name,
    description,
    venueName,
    venueAddress,
    date,
    startTime,
    endTime,
    ticketPrice,
    ticketQuantity,
    poster,
  } = values;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("event")
    .insert([
      {
        name,
        description,
        date,
        start_time: startTime,
        end_time: endTime,
        poster_url: poster,
        organizer_id: user?.id,
      },
    ])
    .select();
  if (!error) {
    redirect("/profile");
  }
  console.log(values);
};

export { createEvent };
