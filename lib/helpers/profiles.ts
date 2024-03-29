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
  const lowerCaseUsername = username?.toLowerCase();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", lowerCaseUsername)
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

const getTempProfileFromID = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: tempUserData, error } = await supabase
    .from("temporary_profiles")
    .select("*")
    .eq("id", id)
    .single();

  const tempProfile: Tables<"temporary_profiles"> = tempUserData || {};
  return { tempProfile, error };
};

const getProfileAvatar = async (avatar_url: string) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(avatar_url);
  return publicUrl;
};

/**
 * Fetches temporary profile data based on a search query. This function searches for profiles by matching the username and business name fields with the provided search string.
 * Additionally, it retrieves and includes the public URL for each profile's avatar from Supabase storage.
 * Note: The function limits the results to a maximum of 6 profiles.
 */
const fetchTemporaryProfiles = async (search: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("temporary_profiles")
    .select("*")
    .or(`username.ilike.%${search}%,business_name.ilike.%${search}%`)
    .limit(6);

  if (profilesData) {
    const profilesWithAvatar = await Promise.all(
      profilesData.map(async (profile) => {
        const {
          data: { publicUrl },
        } = await supabase.storage
          .from("avatars")
          .getPublicUrl(profile.avatar_url);
        return {
          ...profile,
          avatar_url: publicUrl,
        };
      })
    );
    return profilesWithAvatar;
  }
};

export {
  getProfile,
  getProfileByUsername,
  getProfileLinks,
  getProfileAvatar,
  getTempProfile,
  getTempProfileFromID,
  fetchTemporaryProfiles,
};
