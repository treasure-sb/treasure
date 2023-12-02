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
  } = values;
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
