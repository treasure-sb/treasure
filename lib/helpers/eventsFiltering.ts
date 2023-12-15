"use server";

import createSupabaseServerClient from "../../utils/supabase/server";
import format from "date-fns/format";

const today = format(new Date(), "yyyy-MM-dd");

const getTagData = async (tagName: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tags")
    .select("id")
    .eq("name", tagName)
    .single();
  return { data, error };
};

// works for now, but will need to be updated to not use event_tags table directly
const getDateTagEventData = async (
  search: string,
  tagId: string,
  from: string,
  until: string,
  numEvents: number
) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_tags!inner(*)")
    .gte("date", today)
    .ilike("name", `%${search}%`)
    .range(0, numEvents)
    .gte("date", from)
    .lte("date", until)
    .order("featured", { ascending: true })
    .order("date", { ascending: true })
    .eq("event_tags.tag_id", tagId);

  return { data, error };
};

const getEventDataByDate = async (
  search: string,
  from: string,
  until: string,
  numEvents: number
) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .ilike("name", `%${search}%`)
    .order("featured", { ascending: true })
    .order("date", { ascending: true })
    .range(0, numEvents)
    .gte("date", from)
    .lte("date", until);
  return { data, error };
};

const getEventDataByTag = async (
  search: string,
  tagId: string,
  numEvents: number
) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, event_tags!inner(*)")
    .gte("date", today)
    .ilike("name", `%${search}%`)
    .range(0, numEvents)
    .order("featured", { ascending: true })
    .order("date", { ascending: true })
    .eq("event_tags.tag_id", tagId);
  return { data, error };
};

const getAllEventData = async (search: string, numEvents: number) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("featured", { ascending: false })
    .order("date", { ascending: true })
    .ilike("name", `%${search}%`)
    .range(0, numEvents);
  return { data, error };
};

export {
  getTagData,
  getDateTagEventData,
  getEventDataByDate,
  getEventDataByTag,
  getAllEventData,
};
