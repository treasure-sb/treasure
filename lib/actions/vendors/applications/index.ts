"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import { type VendorApplication } from "@/app/(main)/events/[name]/tables/types";
import { sendVendorAppReceivedEmail } from "../../emails";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { EventDisplayData } from "@/types/event";

const submitVendorApplication = async (
  application: VendorApplication,
  event: Tables<"events"> | EventDisplayData
) => {
  const supabase = await createSupabaseServerClient();
  const { error: eventAppError } = await supabase
    .from("event_vendors")
    .insert([application]);

  if (eventAppError) {
    return { error: eventAppError };
  }

  await sendVendorReceivedEmail(event);
  return { error: null };
};

const createVendorTags = async (
  tags: Tables<"tags">[],
  vendorId: string,
  eventId: string
) => {
  const supabase = await createSupabaseServerClient();
  const insertedVendorTags = tags.map((tag) => {
    return {
      event_id: eventId,
      vendor_id: vendorId,
      tag_id: tag.id,
    };
  });

  const { error: vendorTagError } = await supabase
    .from("event_vendor_tags")
    .insert(insertedVendorTags)
    .select();

  return { error: vendorTagError?.message || null };
};

const sendVendorReceivedEmail = async (
  event: Tables<"events"> | EventDisplayData
) => {
  const supabase = await createSupabaseServerClient();
  const { data: hostData } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", event.organizer_id)
    .single();

  const eventPosterUrl = await getPublicPosterUrl(event);
  const { error: sendHostEmailError } = await sendVendorAppReceivedEmail(
    hostData?.email,
    eventPosterUrl,
    event.name,
    event.cleaned_name
  );

  if (hostData?.email !== "treasure20110@gmail.com") {
    const { error: sendAdminEmailError } = await sendVendorAppReceivedEmail(
      "treasure20110@gmail.com",
      eventPosterUrl,
      event.name,
      event.cleaned_name
    );
  }
  return { error: null };
};

export { submitVendorApplication, createVendorTags };
