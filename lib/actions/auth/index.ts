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

export { validateUser, logoutUser };
