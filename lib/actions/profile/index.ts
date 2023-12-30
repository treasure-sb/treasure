"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { profileForm } from "@/types/profile";

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

const createTemporaryProfile = async (
  values: Partial<profileForm> & {
    username: string;
  }
) => {
  const supabase = await createSupabaseServerClient();
  const { first_name, last_name, username, avatar_url, instagram } = values;
  const { data, error: userError } = await supabase
    .from("temporary_profiles")
    .insert([{ first_name, last_name, username, avatar_url, instagram }])
    .select();

  if (!userError) {
    redirect("/profile");
  }
};

export { editProfile, createTemporaryProfile };
