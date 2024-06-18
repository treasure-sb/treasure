import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import TabState from "./components/TabState";
import VerifiedVendors from "./components/verified_vendors/VerifiedVendors";
import VendorAssignment from "./components/assignments/VendorAssignment";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError) {
    redirect("/host/events");
  }

  const displayData = await getEventDisplayData(eventData);

  return (
    <div className="max-w-7xl mx-auto">
      <TabState>
        <VerifiedVendors event={displayData} />
        <VendorAssignment event={displayData} />
      </TabState>
    </div>
  );
}
