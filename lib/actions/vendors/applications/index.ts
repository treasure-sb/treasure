"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorApplication } from "@/types/applications";
import { sendVendorAppReceivedEmail } from "../../emails";

const submitVendorApplication = async (
  application: VendorApplication,
  organizer_id: string
) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_vendors").insert([application]);
  const { data: hostData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", organizer_id)
    .single();
  await sendVendorAppReceivedEmail(hostData?.email);

  return { error };
};

export { submitVendorApplication };
