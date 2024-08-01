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

const fetchTemporaryProfiles = async (search: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("temporary_profiles")
    .select("*")
    .or(`username.ilike.%${search}%,business_name.ilike.%${search}%`)
    .limit(8);

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
  return [];
};

const fetchTemporaryVendors = async (search: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: profilesData } = await supabase
    .from("temporary_profiles")
    .select("*, temporary_vendors(event_id)")
    .or(`username.ilike.%${search}%,business_name.ilike.%${search}%`)
    .limit(4);

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
  return [];
};

const isHostOrCoHost = async (profileId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: roleData } = await supabase
    .from("event_roles")
    .select("role")
    .eq("user_id", profileId)
    .in("role", ["HOST", "COHOST"]);

  return roleData ? roleData.length > 0 : false;
};

export {
  getProfile,
  getProfileByUsername,
  getProfileLinks,
  getProfileAvatar,
  getTempProfile,
  getTempProfileFromID,
  fetchTemporaryProfiles,
  fetchTemporaryVendors,
  isHostOrCoHost,
};
