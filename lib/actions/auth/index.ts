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
  redirect("/account");
};

const checkUsernameExists = async (username: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();
  return data;
};

interface SignUpForm {
  username: string;
  email: string;
  password: string;
  instagram?: string;
  tiktok?: string;
}

const signUp = async (form: SignUpForm) => {
  const { username, email, password, instagram, tiktok } = form;
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
};

export { validateUser, logoutUser, signUp };
