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

type HostTeam = {
  profile: {
    email?: string;
    phone?: string;
  };
};

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

  const { data: hostTeamData } = await supabase
    .from("event_roles")
    .select("profile:profiles(email, phone)")
    .eq("event_id", event.id)
    .eq("status", "ACTIVE")
    .in("role", ["HOST", "COHOST", "STAFF"])
    .returns<HostTeam[]>();

  const hostPhoneNumbers = hostTeamData
    ? hostTeamData
        .map((profile) => profile.profile.phone)
        .filter((phone): phone is string => phone !== null)
    : [];

  const hostEmails = hostTeamData
    ? hostTeamData
        .map((profile) => profile.profile.email)
        .filter((email): email is string => email !== null)
    : [];

  if (hostPhoneNumbers.length > 0) {
    const sendHostSMSPayload: HostSoldPayload = {
      phones: hostPhoneNumbers,
      businessName: vendorInfo.businessName,
      firstName: vendorInfo.firstName,
      lastName: vendorInfo.lastName,
      eventName: event.name,
      eventDate: undefined,
      eventCleanedName: event.cleaned_name,
    };
    await sendHostVendorAppReceievedSMS(sendHostSMSPayload);
  }

  if (hostEmails.length > 0) {
    await sendVendorReceivedEmail(event, hostEmails);
  }
  if (
    process.env.NODE_ENV === "production" &&
    !hostEmails.includes("treasure20110@gmail.com")
  ) {
    const eventPosterUrl = await getPublicPosterUrl(event);
    await sendVendorAppReceivedEmail(
      ["treasure20110@gmail.com"],
      eventPosterUrl,
      event.name,
      event.cleaned_name
    );
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
  hostEmails: string[]
) => {
  const eventPosterUrl = await getPublicPosterUrl(event);

  await sendVendorAppReceivedEmail(
    hostEmails,
    eventPosterUrl,
    event.name,
    event.cleaned_name
  );
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
