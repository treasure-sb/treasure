"use server";

import createSupabaseServerClient from "@/utils/supabase/server";
import {
  type VendorInfo,
  type VendorApplication,
} from "@/app/(main)/events/[name]/tables/types";
import { sendVendorAppReceivedEmail } from "../../emails";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { EventDisplayData } from "@/types/event";
import { HostSoldPayload } from "@/lib/sms";
import { sendHostVendorAppReceievedSMS } from "@/lib/sms";

const submitVendorApplication = async (
  application: VendorApplication,
  event: EventDisplayData,
  vendorInfo: VendorInfo
) => {
  const supabase = await createSupabaseServerClient();
  const { error: eventAppError } = await supabase
    .from("event_vendors")
    .insert([application]);

  if (eventAppError) {
    return { error: eventAppError };
  }

  const { data: hostData } = await supabase
    .from("profiles")
    .select("email, phone")
    .eq("id", event.organizer_id)
    .single();

  const hostContactInfo: { email?: string; phone?: string } = hostData || {};
  if (hostContactInfo.phone) {
    const sendHostSMSPayload: HostSoldPayload = {
      phone: hostContactInfo.phone,
      businessName: vendorInfo.businessName,
      firstName: vendorInfo.firstName,
      lastName: vendorInfo.lastName,
      eventName: event.name,
      eventDate: event.date,
      eventCleanedName: event.cleaned_name
    };
    await sendHostVendorAppReceievedSMS(sendHostSMSPayload);
  }
  if (hostContactInfo.email) {
    await sendVendorReceivedEmail(event, hostContactInfo.email);
  }
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
  event: EventDisplayData,
  hostEmail: string
) => {
  const eventPosterUrl = await getPublicPosterUrl(event);

  await sendVendorAppReceivedEmail(
    hostEmail,
    eventPosterUrl,
    event.name,
    event.cleaned_name
  );

  if (hostEmail !== "treasure20110@gmail.com") {
    await sendVendorAppReceivedEmail(
      "treasure20110@gmail.com",
      eventPosterUrl,
      event.name,
      event.cleaned_name
    );
  }
  return { error: null };
};

const moveVendors = async (
  vendorId: string,
  oldEventId: string,
  oldTableId: string,
  newEventId: string
) => {
  const supabase = await createSupabaseServerClient();

  const { data: newTableData } = await supabase
    .from("tables")
    .select("id")
    .eq("event_id", newEventId)
    .single();

  const newTableId = newTableData?.id;

  const { data, error } = await supabase
    .from("event_vendors")
    .update({ table_id: newTableId, event_id: newEventId })
    .eq("event_id", oldEventId)
    .eq("vendor_id", vendorId)
    .eq("table_id", oldTableId)
    .select();

  const { data: tags, error: errTags } = await supabase
    .from("event_vendor_tags")
    .update({ event_id: newEventId })
    .eq("event_id", oldEventId)
    .eq("vendor_id", vendorId)
    .select();

  return error;
};

export { submitVendorApplication, createVendorTags, moveVendors };
