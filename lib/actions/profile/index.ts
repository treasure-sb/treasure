"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { profileForm } from "@/types/profile";
import { newProfileToBasic } from "../subscriptions";

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

export interface UpdateProfile {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  business_name?: string | null;
  phone?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
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
    .select()
    .single();

  if (error) {
    return { profileData: null, error };
  }

  const profileData: Tables<"profiles"> = data;
  await newProfileToBasic(profileData);
  await assignGuestTickets(profileData.id || "", createProfileData);
  return { profileData, error };
};

const assignGuestTickets = async (
  profileId: string,
  createProfileData: CreateProfileData
) => {
  const supabase = await createSupabaseServerClient();
  const { phone, email } = createProfileData;
  const { data: guestProfileData } = await supabase
    .from("profiles")
    .select("id")
    .eq("guest", true)
    .single();

  const guestProfileId: string = guestProfileData?.id || "";

  const { error } = await supabase
    .from("event_tickets")
    .update({ attendee_id: profileId })
    .or(`phone.eq.${phone}, email.eq.${email}`)
    .eq("attendee_id", guestProfileId);

  return { error };
};

const updateProfile = async (
  updateProfileData: UpdateProfile,
  profileId: string
) => {
  const supabase = await createSupabaseServerClient();
  const definedUpdates = Object.entries(updateProfileData).reduce(
    (acc: UpdateProfile, [key, value]) => {
      if (value !== undefined) {
        const keyType = key as keyof UpdateProfile;
        acc[keyType] = value;
      }
      return acc;
    },
    {} as UpdateProfile
  );

  const { data, error } = await supabase
    .from("profiles")
    .update(definedUpdates)
    .eq("id", profileId)
    .select();

  return { data, error };
};

const profileExists = async (id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", id)
    .single();
  return { data, error };
};

// TODO: Fix to use transaction
const updatePhone = async (phone: string, profileId: string) => {
  const supabase = await createSupabaseServerClient();
  const { error: authUpdateError } = await supabase.auth.updateUser({
    phone,
  });

  if (authUpdateError) {
    return { success: false, error: authUpdateError };
  }

  const { error: profileUpdateError } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", profileId);

  if (profileUpdateError) {
    return { success: false, error: profileUpdateError };
  }

  return { success: true };
};

/* TODO: Fix to only use 1 function */
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

/* TODO: Fix to only use 1 function */
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
  updateProfile,
  updatePhone,
  updateProfileAvatar,
  createTemporaryProfile,
  addAdditionalInfo,
  createProfile,
  profileExists,
};
