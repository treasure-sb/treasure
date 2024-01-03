"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { profileForm } from "@/types/profile";

interface createProfileData {
  first_name: string;
  last_name: string;
  username: string;
  discriminator: number;
  email: string;
  id: string;
}

const createProfile = async (createProfileData: createProfileData) => {
  const supabase = await createSupabaseServerClient();
  const { first_name, last_name, username, discriminator, email, id } =
    createProfileData;
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        first_name,
        last_name,
        username,
        discriminator,
        email,
        id,
      },
    ])
    .select();

  const profileData: Tables<"profiles"> | null = data ? data[0] : null;
  return { profileData, error };
};

const editProfile = async (values: profileForm) => {
  const supabase = await createSupabaseServerClient();
  const { first_name, last_name, instagram, twitter, bio, avatar_url } = values;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .update({ first_name, last_name, bio, avatar_url })
    .eq("id", user?.id)
    .select();

  const { data: links, error: linksError } = await supabase
    .from("links")
    .insert([
      { user_id: user?.id, username: instagram, type: "instagram" },
      { user_id: user?.id, username: twitter, type: "twitter" },
    ])
    .select();
  if (!linksError && !error) {
    redirect("/profile");
  } else {
    console.log("links error", linksError, "profile error", error);
  }
};

const createLink = async (user_id: string, username: string, type: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("links")
    .insert([{ user_id, username, type }])
    .select();

  return { data, error };
};

const updateProfileAvatar = async (avatar_url: string, user_id: string) => {
  const supabase = await createSupabaseServerClient();
  await supabase.from("profiles").update({ avatar_url }).eq("id", user_id);
};

const createTemporaryProfile = async (
  values: Partial<profileForm> & {
    username: string;
    business_name: string;
  }
) => {
  const supabase = await createSupabaseServerClient();
  const { business_name, username, avatar_url, instagram } = values;
  const { data, error: userError } = await supabase
    .from("temporary_profiles")
    .insert([{ business_name, username, avatar_url, instagram }])
    .select();

  if (!userError) {
    redirect("/profile");
  }
};

export {
  editProfile,
  createLink,
  updateProfileAvatar,
  createTemporaryProfile,
  createProfile,
};
