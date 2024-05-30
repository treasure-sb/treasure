"use server";

import createSupabaseServerClient from "@/utils/supabase/server";

type EventTag = {
  event_id: string;
  tag_id: string;
};

const addEventTags = async (tags: EventTag[]) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_tags").insert(tags);
  return { error };
};

const removeEventTags = async (tags: EventTag[]) => {
  const supabase = await createSupabaseServerClient();
  for (const tag of tags) {
    const { error } = await supabase
      .from("event_tags")
      .delete()
      .eq("event_id", tag.event_id)
      .eq("tag_id", tag.tag_id);
    if (error) {
      return { error };
    }
  }
  return { error: null };
};

export { addEventTags, removeEventTags, type EventTag };
