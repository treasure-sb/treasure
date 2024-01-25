import { columns } from "./table/VendorDataColumns";
import { validateUser } from "@/lib/actions/auth";
import { eventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import createSupabaseServerClient from "@/utils/supabase/server";
import DataTable from "./table/DataTable";

export type EventVendorProfile = Tables<"event_vendors"> & {
  vendor: Tables<"profiles">;
};

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .eq("cleaned_name", event)
    .single();

  const displayData = await eventDisplayData([eventData]);
  const hostedEvent = displayData[0];

  const { data: eventVendorData } = await supabase
    .from("event_vendors")
    .select("*, vendor:profiles(*)")
    .eq("event_id", hostedEvent.id);

  const eventVendors = eventVendorData as EventVendorProfile[];
  const tableDataPromise = eventVendors.map(async (eventVendor) => {
    const avatar = await getProfileAvatar(eventVendor.vendor.avatar_url);
    return {
      avatar_url: avatar,
      name: `${eventVendor.vendor.first_name} ${eventVendor.vendor.last_name}`,
      payment_status: eventVendor.payment_status,
      vendor_status: eventVendor.application_status,
      vendor_info: eventVendor,
    };
  });
  const vendorsTableData = await Promise.all(tableDataPromise);

  return (
    <div>
      <div className="max-w-7xl mx-auto py-10">
        <DataTable columns={columns} data={vendorsTableData || []} />
      </div>
    </div>
  );
}
