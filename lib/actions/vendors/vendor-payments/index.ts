"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { paymentsForm } from "@/types/profile";

const editPaymentMethods = async (values: paymentsForm) => {
  const supabase = await createSupabaseServerClient();
  const keys = Object.keys(values);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  keys.forEach(async (key) => {
    const { data: del, error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("type", key)
      .eq("user_id", user?.id);

    if (values[key as keyof typeof values].length === 0) return;
    const { data, error } = await supabase.from("links").insert({
      user_id: user?.id,
      username: values[key as keyof typeof values],
      type: key,
    });
    if (error) console.log(error);
  });

  redirect("/vendors");
};

export { editPaymentMethods };
