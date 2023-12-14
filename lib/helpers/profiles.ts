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

  const profile: Tables<"profiles"> = data || {};
  return profile;
};

export { getProfile };
