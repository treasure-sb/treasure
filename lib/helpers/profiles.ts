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

  const profile: Tables<"profiles"> = data;
  return { profile, error };
};

const getProfileByUsername = async (username: string | undefined) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  const profile: Tables<"profiles"> = data;
  return { profile, error };
};

const getProfileLinks = async (id: string | undefined) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", id);

  const links: Tables<"links">[] = data || [];
  return { links, error };
};

const getTempProfile = async (username: string | undefined) => {
  const supabase = await createSupabaseServerClient();
  const { data: tempUserData, error } = await supabase
    .from("temporary_profiles")
    .select("*")
    .eq("username", username)
    .single();

  const tempProfile: Tables<"temporary_profiles"> = tempUserData || {};
  return { tempProfile, error };
};

export { getProfile, getProfileByUsername, getProfileLinks, getTempProfile };
