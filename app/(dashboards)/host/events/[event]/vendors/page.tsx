import { columns } from "./components/table/VendorDataColumns";
import { validateUser } from "@/lib/actions/auth";
import { eventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import DataTable from "./components/table/DataTable";

type EventVendorTableInfo = {
  section_name: string;
  id: string;
};

export type EventVendorData = Tables<"event_vendors"> & {
  vendor: Tables<"profiles"> & {
    links: {
      username: string;
      application: string;
    }[];
  };
} & {
  table: EventVendorTableInfo;
};

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", event)
    .single();

  if (eventError) {
    redirect("/");
  }

  const displayData = await eventDisplayData([eventData]);
  const hostedEvent = displayData[0];

  const { data: eventVendorData } = await supabase
    .from("event_vendors")
    .select(
      "*, vendor:profiles(*, links(username, application)), table:tables(section_name, id)"
    )
    .eq("event_id", hostedEvent.id);

  const eventVendors = eventVendorData as EventVendorData[];
  const tableDataPromise = eventVendors.map(async (eventVendor) => {
    const avatar = await getProfileAvatar(eventVendor.vendor.avatar_url);
    return {
      avatar_url: avatar,
      name: `${eventVendor.vendor.first_name} ${eventVendor.vendor.last_name}`,
      section: eventVendor.table.section_name as string,
      payment_status: eventVendor.payment_status,
      application_status: eventVendor.application_status,
      vendor_info: eventVendor,
    };
  });
  const vendorsTableData = await Promise.all(tableDataPromise);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <DataTable
        columns={columns}
        data={vendorsTableData || []}
        eventData={hostedEvent}
      />
    </div>
  );
}
