"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

const getProfile = async (id: string | undefined) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("username, type")
    .eq("user_id", id);

  let joined = { ...data };
  links?.forEach((link) => {
    joined = { ...joined, [link.type]: link.username };
  });

  const profile: Tables<"profiles"> = joined || {};
  return profile;
};

export { getProfile };
