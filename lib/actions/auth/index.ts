"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const validateUser = async () => {
  const supabase = await createSupabaseServerClient();
  return supabase.auth.getUser();
};

const logoutUser = async () => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
};

const generateUniqueLocalDiscriminator = (
  discriminators: any[] | undefined
) => {
  if (!discriminators || discriminators.length === 0) {
    return 1;
  }

  const sortedDiscriminators = discriminators.sort((a, b) => a - b);
  const lastDiscriminator =
    sortedDiscriminators[sortedDiscriminators.length - 1];
  return lastDiscriminator + 1;
};

interface SignUpForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const signUp = async (form: SignUpForm) => {
  const { firstName, lastName, email, password } = form;
  const supabase = await createSupabaseServerClient();

  // if error is returned email is already in use
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (signUpError) {
    return { error: { type: "email_taken", message: "Email already taken" } };
  }

  // if email is unique create a profile
  if (signUpData.user) {
    const username = email.split("@")[0];
    const firstNameCapitalized =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);
    const lastNameCapitalized =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // get discriminator
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("discriminator")
      .eq("username", username);

    const previousDiscriminators = profilesData?.map(
      (profile) => profile.discriminator
    );

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          first_name: firstNameCapitalized,
          last_name: lastNameCapitalized,
          username,
          discriminator: generateUniqueLocalDiscriminator(
            previousDiscriminators
          ),
          email,
          id: signUpData.user.id,
        },
      ])
      .select();
    return { data };
  }
};

interface LoginForm {
  email: string;
  password: string;
}

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

  redirect("/");
};

export { validateUser, logoutUser, signUp, login };
