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
import { profileExists } from "../profile";

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

  console.log(error);

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

  const { data: verificationData, error: verificationError } =
    await verifyLoginOtp(verificationPayload);
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
    email,
    firstName: "Anonymous",
    lastName: listOfNames[Math.floor(Math.random() * listOfNames.length)],
  });

  return error
    ? { error: "Error creating profile" }
    : { data: profileData, success: true, profileExists: false };
};

const verifyLoginOtp = async ({ phone, email, code }: VerificationProps) => {
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

const verifyPhoneChangeOTP = async (phone: string, code: string) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token: code,
    type: "phone_change",
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
};

const verifyEmailChangeOTP = async (email: string, code: string) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email_change",
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
};

const updateUserPhone = async (phone: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ phone });
  return { data, error };
};

const updateUserEmail = async (email: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ email });
  return { data, error };
};

const createUserProfile = async (userFields: UserProfile) => {
  const { phone, email, firstName, lastName, id } = userFields;
  const uuidSegment = uuidv4().split("-")[0];
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uuidSegment}`;
  const previousDiscriminators = await getPreviousDiscriminators(username);

  const profileData = {
    firstName: capitalize(firstName),
    lastName: capitalize(lastName),
    username,
    discriminator: generateUniqueLocalDiscriminator(previousDiscriminators),
    phone,
    email,
    id,
  };
  return await createProfile(profileData);
};

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

export {
  validateUser,
  logoutUser,
  signUpUser,
  verifyUser,
  verifyPhoneChangeOTP,
  verifyEmailChangeOTP,
  updateUserPhone,
  updateUserEmail,
};
