"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSignupInviteData } from "@/lib/helpers/auth";
import { getTempProfileFromID } from "@/lib/helpers/profiles";
import { updateProfileAvatar, createProfile } from "../profile";
import { createLink } from "../links";
import { VerifyOtpParams } from "@supabase/supabase-js";
import { capitalize } from "@/lib/utils";
import {
  generateUniqueLocalDiscriminator,
  getPreviousDiscriminators,
} from "@/lib/helpers/auth";
import { sendWelcomeEmail } from "../emails";
import { v4 as uuidv4 } from "uuid";

interface UserProfile {
  phone?: string;
  email?: string;
  firstName: string;
  lastName: string;
  id: string;
}

interface SignUpProps {
  phone?: string;
  email?: string;
  signupInviteToken?: string;
}

interface VerificationProps {
  phone?: string;
  email?: string;
  code: string;
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
  "Koala",
  "Dolphin",
  "Skunk",
];

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
const signUpUser = async ({ phone, email, signupInviteToken }: SignUpProps) => {
  const supabase = await createSupabaseServerClient();

  if (!phone && !email) {
    return {
      success: false,
      error: {
        type: "input_validation_error",
        message: "Either phone or email must be provided.",
      },
    };
  }

  const signInPayload = phone ? { phone } : email ? { email } : null;
  if (!signInPayload) {
    return {
      success: false,
      error: {
        type: "input_validation_error",
        message: "Either phone or email must be provided.",
      },
    };
  }

  const { error } = await supabase.auth.signInWithOtp(signInPayload);
  if (error) {
    return {
      success: false,
      error: {
        type: "create_user_error",
        message: "There was an error creating the user",
      },
    };
  }

  return { success: true };
};

/**
 * Verifies a user's OTP using either phone or email and either reports existing profile or creates a new one.
 */
const verifyUser = async ({ phone, email, code }: VerificationProps) => {
  if (!phone && !email) {
    return { error: "Either phone or email must be provided" };
  }

  const verificationPayload = phone
    ? { phone, code }
    : email
    ? { email, code }
    : null;
  if (!verificationPayload) {
    return { error: "Either phone or email must be provided" };
  }

  const { data: verificationData, error: verificationError } = await verifyOtp(
    verificationPayload
  );
  if (verificationError || !verificationData?.user) {
    return { error: verificationError || "User not found" };
  }

  const { data: profileExistsData } = await profileExists(
    verificationData.user.id
  );

  if (profileExistsData) {
    return { error: null, profileExists: true, success: true };
  }

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

const verifyOtp = async ({ phone, email, code }: VerificationProps) => {
  const supabase = await createSupabaseServerClient();
  if (!phone && !email) {
    return { error: "Either phone or email must be provided" };
  }

  const verificationPayload: VerifyOtpParams | null = phone
    ? { phone, token: code, type: "sms" }
    : email
    ? { email, token: code, type: "email" }
    : null;
  if (!verificationPayload) {
    return { error: "Either phone or email must be provided" };
  }

  const { data, error } = await supabase.auth.verifyOtp(verificationPayload);
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

export { validateUser, logoutUser, signUpUser, verifyUser };
