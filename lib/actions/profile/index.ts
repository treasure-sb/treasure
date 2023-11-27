"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { profileForm } from "@/types/profile";

const editProfile = async (values: profileForm) => {
  const supabase = await createSupabaseServerClient();
  const { first_name, last_name, instagram, twitter, bio, avatar_url } = values;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .update({ first_name, last_name, instagram, twitter, bio, avatar_url })
    .eq("id", user?.id)
    .select();
  if (!error) {
    redirect("/profile");
  } else {
    console.log(error);
  }
};

export { editProfile };
