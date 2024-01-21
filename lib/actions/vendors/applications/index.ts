"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorApplication } from "@/types/applications";

const submitVendorApplication = async (application: VendorApplication) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_vendors").insert([application]);
  return { error };
};

export { submitVendorApplication };
