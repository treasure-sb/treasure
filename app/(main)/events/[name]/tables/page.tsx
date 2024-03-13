import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import createSupabaseServerClient from "@/utils/supabase/server";
import TablesFlow from "./components/TablesFlow";

export default async function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await validateUser();

  const { profile: profileData } = await getProfile(user?.id);
  const profile: Tables<"profiles"> | null = profileData;

  const { name } = params;
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
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
    <TablesFlow
      eventDisplay={eventDisplayData}
      tables={tables}
      user={user}
      vendorInfo={vendorInfo}
      terms={terms}
      profile={profile}
    />
  );
}
