"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSignupInviteData } from "@/lib/helpers/auth";
import { getTempProfileFromID } from "@/lib/helpers/profiles";
import { updateProfileAvatar, createProfile } from "../profile";
import { createLink } from "../links";
import { User } from "@supabase/supabase-js";
import { capitalize } from "@/lib/utils";
import {
  generateUniqueLocalDiscriminator,
  getPreviousDiscriminators,
} from "@/lib/helpers/auth";
import { sendWelcomeEmail } from "../emails";
import { v4 as uuidv4 } from "uuid";

interface UserProfile {
  phone: string;
  firstName: string;
  lastName: string;
  id: string;
}

interface LoginForm {
  email: string;
  password: string;
}

const validateUser = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.getUser();
};

const logoutUser = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
};

/**
 * Handles the sign-up process for new users, optionally transferring a temporary profile if an invite token is provided.
 */
const signUpUser = async (phone: string, signupInviteToken?: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return {
      success: false,
      error: {
        type: "create_user_error",
        message: "There's was an error creating the user",
      },
    };
  }
  return { success: true, user: data.user };
};

/**
 * Verifies a user's OTP and either reports existing profile or creates a new one.
 */
const verifyUser = async (phone: string, code: string) => {
  const { data: verificationData, error: verificationError } = await verifyOtp(
    phone,
    code
  );
  if (verificationError) {
    return { error: verificationError };
  }
  if (!verificationData.user) {
    return { error: "User not found" };
  }

  const { data: profileExistsData, error: profileExistsError } =
    await profileExists(verificationData.user.id);
  if (profileExistsData) {
    return { error: null, profileExists: true, success: true };
  }

  const listOfNames = [
    "Kangaroo",
    "Turtle",
    "Lion",
    "Zebra",
    "Elephant",
    "Giraffe",
    "Hippo",
    "Rhino",
    "Panda",
    "Penguin",
    "Bear",
  ];
  const { profileData, error } = await createUserProfile({
    id: verificationData.user.id,
    phone,
    firstName: "Anonymous",
    lastName: listOfNames[Math.floor(Math.random() * listOfNames.length)],
  });

  return error
    ? { error: "Error creating profile" }
    : { data: profileData, success: true, profileExists: false };
};

const verifyOtp = async (phone: string, code: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone: `${phone}`,
    token: `${code}`,
    type: "sms",
  });
  return { data, error: error?.message };
};

/**
 * Creates a user profile in the database with the provided user information.
 */
const createUserProfile = async (userFields: UserProfile) => {
  const { phone, firstName, lastName, id } = userFields;
  const uuidSegment = uuidv4().split("-")[0];
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uuidSegment}`;
  const previousDiscriminators = await getPreviousDiscriminators(username);

  const profileData = {
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    username,
    discriminator: generateUniqueLocalDiscriminator(previousDiscriminators),
    phone,
    id,
  };
  return await createProfile(profileData);
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

/**
 * Transfers data from a temporary profile to a newly created user profile, based on a given invite token.
 * It involves updating profile transfers, potentially creating a new link (e.g., for Instagram), and updating the profile avatar.
 *
 * @param {string} token - The invite token that corresponds to a temporary profile.
 * @param {string} user_id - The ID of the newly created user to whom the temporary profile's data will be transferred.
 * @returns {Promise<{success: boolean, error?: {type: string, message: string}}>} - A promise that resolves to an object indicating the success or failure of the transfer. If unsuccessful, the object includes an 'error' object with details about the failure.
 */
const transferTemporaryProfile = async (token: string, user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const signupInviteData = await getSignupInviteData(token);
  if (!signupInviteData) {
    return {
      success: false,
      error: { type: "invalid_invite_token", message: "Invalid Invite Token" },
    };
  }

  const { tempProfile } = await getTempProfileFromID(
    signupInviteData.temp_profile_id
  );
  if (!tempProfile) {
    return {
      success: false,
      error: { type: "invalid_invite_token", message: "Invalid Invite Token" },
    };
  }

  await supabase
    .from("profile_transfers")
    .insert([{ temp_profile_id: tempProfile.id, new_user_id: user_id }]);
  if (tempProfile.instagram) {
    await createLink(user_id, tempProfile.instagram, "instagram");
  }
  await updateProfileAvatar(tempProfile.avatar_url, user_id);

  return { success: true };
};

const login = async (form: LoginForm) => {
  const { email, password } = form;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: {
        type: "invalid_credentials",
        message: "Invalid Login Credentials",
      },
    };
  }

  return { data, error };
};

export { validateUser, logoutUser, signUpUser, verifyUser, login };
