"use server";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorApplication } from "@/app/(main)/events/[name]/tables/components/vendor_applications/steps/ReviewInformation";
import { sendVendorAppReceivedEmail } from "../../emails";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { EventDisplayData } from "@/types/event";

const submitVendorApplication = async (
  application: VendorApplication,
  event: Tables<"events"> | EventDisplayData
) => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("event_vendors").insert([application]);

  if (error) {
    return { error };
  }

  const { data: hostData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", event.organizer_id)
    .single();

  const eventPosterUrl = await getPublicPosterUrl(event);
  await sendVendorAppReceivedEmail(hostData?.email, eventPosterUrl, event.name);
  return { error: null };
};

export { submitVendorApplication };
