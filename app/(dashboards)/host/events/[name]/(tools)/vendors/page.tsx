import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import TabState from "./components/TabState";
import VendorApplications from "./components/vendor_applications/VendorApplications";
import VendorAssignment from "./components/assignments/VendorAssignment";
import TempVendors from "./components/temp_vendors/TempVendors";

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
        <VendorApplications event={displayData} />
        <TempVendors />
        <VendorAssignment event={displayData} />
      </TabState>
    </div>
  );
}
