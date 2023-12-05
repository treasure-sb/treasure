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

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  instagram?: string;
  twitter?: string;
}

const signUp = async (form: SignUpForm) => {
  const { username, email, password, instagram, twitter } = form;
  const supabase = await createSupabaseServerClient();

  // check if username is taken
  const { data: usernameData, error: usernameError } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (usernameData) {
    return {
      error: { type: "username_taken", message: "Username already taken" },
    };
  }

  // if error is returned email is already in use
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (signUpError) {
    return { error: { type: "email_taken", message: "Email already taken" } };
  }

  // username and email are unique so create profile
  if (signUpData.user) {
    await supabase.from("profiles").insert([
      {
        username,
        email,
        instagram,
        twitter,
        id: signUpData.user.id,
      },
    ]);
    redirect("/");
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
