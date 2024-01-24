"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorApplication } from "@/types/applications";
import { sendVendorAppReceivedEmail } from "../../emails";

const submitVendorApplication = async (application: VendorApplication) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_vendors").insert([application]);
  const { data: vendorData } = await supabase
    .from("profiles")
    .select("username,email")
    .eq("id", application.vendor_id)
    .single();
  await sendVendorAppReceivedEmail(
    vendorData?.email,
    "https://ontreasure.xyz/" + vendorData?.username
  );

  return { error };
};

export { submitVendorApplication };
