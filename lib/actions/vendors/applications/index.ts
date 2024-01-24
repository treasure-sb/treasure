"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorApplication } from "@/types/applications";
import { sendVendorAppReceivedEmail } from "../../emails";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";

const submitVendorApplication = async (
  application: VendorApplication,
  event: Tables<"events">
) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_vendors").insert([application]);
  const { data: hostData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", event.organizer_id)
    .single();

  const eventPosterUrl = await getPublicPosterUrl(event);
  await sendVendorAppReceivedEmail(hostData?.email, eventPosterUrl, event.name);

  return { error };
};

export { submitVendorApplication };
