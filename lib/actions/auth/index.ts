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

interface SignUpForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
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
 * Attempts to sign up a new user with the provided email and password using the Supabase authentication service.
 *
 * @param {string} email - The email address of the user attempting to sign up.
 * @param {string} password - The password for the new user account.
 * @returns {Promise<{success: boolean, user?: any, error?: {type: string, message: string}}>} - A promise that resolves to an object. If successful, the object contains a 'success' flag set to true and the user's data. If unsuccessful, it includes an 'error' object with details about the failure.
 */
const signUpUser = async (email: string, password: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) {
    return {
      success: false,
      error: { type: "email_taken", message: "Email already taken" },
    };
  }
  return { success: true, user: signUpData.user };
};

/**
 * Handles the sign-up process for new users, optionally transferring a temporary profile if an invite token is provided.
 *
 * @param {SignUpForm} form - The sign-up form data including first name, last name, email, and password.
 * @param {string} [signup_invite_token] - Optional token for signing up with a temporary profile.
 * @returns {Promise<{profileData?: any, error?: any}>} - A promise that resolves to an object containing either the user's profile data upon successful sign-up or an error if the process fails.
 */

const signUp = async (form: SignUpForm, signup_invite_token?: string) => {
  const { firstName, lastName, email, password } = form;

  const signUpResult = await signUpUser(email, password);
  if (!signUpResult.success) {
    return { error: signUpResult.error };
  }

  const { profileData } = await createUserProfile(
    signUpResult.user as User,
    firstName,
    lastName,
    email
  );

  if (signup_invite_token) {
    const transferResult = await transferTemporaryProfile(
      signup_invite_token,
      signUpResult.user?.id as string
    );
    if (!transferResult.success) {
      return { error: transferResult.error };
    }
  }

  return { profileData };
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

/**
 * Creates a user profile in the database with the provided user information.
 * It generates a unique username based on the email address and a discriminator
 * to ensure uniqueness in case of username collisions.
 *
 * @param {User} user - The user object, typically containing user identification information.
 * @param {string} first_name - The first name of the user.
 * @param {string} last_name - The last name of the user.
 * @param {string} email - The email address of the user.
 * @returns {Promise<any>} - A promise that resolves to the created profile data. The promise may resolve to 'null' or an error object if the profile creation fails.
 */
const createUserProfile = async (
  user: User,
  first_name: string,
  last_name: string,
  email: string
) => {
  const username = email.split("@")[0];
  const firstNameCapitalized = capitalize(first_name);
  const lastNameCapitalized = capitalize(last_name);

  const previousDiscriminators = await getPreviousDiscriminators(username);
  const profileData = {
    first_name: firstNameCapitalized,
    last_name: lastNameCapitalized,
    username,
    discriminator: generateUniqueLocalDiscriminator(previousDiscriminators),
    email,
    id: user.id,
  };

  return await createProfile(profileData);
};

const login = async (form: LoginForm) => {
  const { email, password } = form;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
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

  redirect("/");
};

export { validateUser, logoutUser, signUp, login };
