import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import TableFlowConsumer from "./components/TableFlowConsumer";

export type Link = {
  username: string;
  application: string;
};

export type ProfileWithInstagram = Tables<"profiles"> & {
  instagram?: string;
};

export default async function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const supabase = await createSupabaseServerClient();
  const eventName = params.name;

  const {
    data: { user },
  } = await validateUser();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: linksData } = await supabase
    .from("links")
    .select("username, application")
    .eq("user_id", user?.id);

  const profile: Tables<"profiles"> = profileData;
  const links: Link[] = linksData || [];

  let profileWithInstagram: ProfileWithInstagram | null = null;

  if (profile) {
    profileWithInstagram = {
      ...profile,
      instagram: links.find((link) => link.application === "Instagram")
        ?.username,
    };
  }

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplayData = await getEventDisplayData(event);

  if (eventError) {
    redirect("/events");
  }

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });
  const tables: Tables<"tables">[] = tablesData || [];

  const { data: vendorApplicationInfoData } = await supabase
    .from("application_vendor_information")
    .select("*")
    .eq("event_id", event?.id)
    .single();
  const vendorInfo: Tables<"application_vendor_information"> =
    vendorApplicationInfoData;

  const { data: termsData } = await supabase
    .from("application_terms_and_conditions")
    .select("*")
    .eq("event_id", event.id);
  const terms: Tables<"application_terms_and_conditions">[] = termsData || [];

  return (
    <TableFlowConsumer
      eventDisplay={eventDisplayData}
      tables={tables}
      generalVendorInfo={vendorInfo}
      terms={terms}
      profile={profileWithInstagram}
    />
  );
}
