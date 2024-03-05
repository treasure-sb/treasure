"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { profileForm } from "@/types/profile";

interface CreateProfileData {
  firstName: string;
  lastName: string;
  username: string;
  discriminator: number;
  phone?: string;
  email?: string;
  id: string;
}

interface AdditionalInfo {
  firstName: string;
  lastName: string;
}

const createProfile = async (createProfileData: CreateProfileData) => {
  const supabase = await createSupabaseServerClient();
  const { firstName, lastName, ...rest } = createProfileData;
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        ...rest,
      },
    ])
    .select();

  const profileData: Tables<"profiles"> | null = data ? data[0] : null;
  return { profileData, error };
};

const editProfile = async (values: any, profileId: string) => {
  const supabase = await createSupabaseServerClient();
  const { first_name, last_name, business_name, bio, avatar_url } = values;

  const { data, error } = await supabase
    .from("profiles")
    .update({ first_name, last_name, business_name, bio, avatar_url })
    .eq("id", profileId)
    .select();

  if (!error && data) {
    const profile: Tables<"profiles"> = data[0];
    redirect(`/${profile.username}`);
  }
};

const addAdditionalInfo = async (
  additionalInfo: AdditionalInfo,
  profileId: string
) => {
  const supabase = await createSupabaseServerClient();
  const { firstName, lastName } = additionalInfo;
  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
    })
    .eq("id", profileId)
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
  updateProfileAvatar,
  createTemporaryProfile,
  addAdditionalInfo,
  createProfile,
};
