"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EditEventForm, EventFormTag } from "@/types/event";

const editEvent = async (
  values: EditEventForm,
  id: string,
  tags: EventFormTag[]
) => {
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

  // Update event on ticket tailor
  const { data: ticketTailorID } = await supabase
    .from("events")
    .select("ticket_tailor_event_id")
    .eq("id", id);

  const updatedTicketTailorEvent = {
    name: name,
    description: description,
    venue_name: venue_name,
  };

  const updatedTicketTailorDate = {
    start_date: date?.toISOString().split("T")[0],
    end_date: date?.toISOString().split("T")[0],
    end_time: start_time + ":00",
    start_time: end_time + ":00",
  };

  const event_id = ticketTailorID?.pop()?.ticket_tailor_event_id;

  // Update the event on supabase
  const { data, error } = await supabase
    .from("events")
    .update({
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
    })
    .eq("id", id)
    .select();
  if (!error) {
    await editTags(tags, id);

    redirect("/events");
  } else {
    console.log(error);
  }
};

const editTags = async (tags: EventFormTag[], event_id: string) => {
  const supabase = await createSupabaseServerClient();
  await supabase.from("event_tags").delete().eq("event_id", event_id);
  tags.forEach(async (tag: any) => {
    await supabase
      .from("event_tags")
      .insert([
        {
          event_id,
          tag_id: tag[1],
        },
      ])
      .select();
  });
};

export { editEvent };
