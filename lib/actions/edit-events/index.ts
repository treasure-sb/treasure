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

const addGuest = async (values: {
  name: string;
  bio: string;
  avatar_url: string;
  event_id: string;
}) => {
  const supabase = await createSupabaseServerClient();
  let { name, bio, avatar_url, event_id } = values;

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("cleaned_name", event_id)
    .single();

  event_id = eventData?.id;

  const { data, error: userError } = await supabase
    .from("event_guests")
    .insert([{ name, bio, avatar_url, event_id }])
    .select();
};

export { editEvent, addGuest };
