import { columns } from "./components/table/VendorDataColumns";
import { getEventDisplayData } from "@/lib/helpers/events";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { redirect } from "next/navigation";
import { EventVendorData, TagData } from "./types";
import createSupabaseServerClient from "@/utils/supabase/server";
import DataTable from "./components/table/DataTable";

export default async function Page({
  params: { eventName },
}: {
  params: { eventName: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();

  if (eventError) {
    redirect("/");
  }

  const displayData = await getEventDisplayData(eventData);

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", displayData.id);

  const eventTagsData = tagsData as unknown as TagData[];
  const eventTags = eventTagsData.map((tag) => tag.tags.name);

  const { data: eventVendorData } = await supabase
    .from("event_vendors")
    .select(
      "*, vendor:profiles(*, links(username, application)), table:tables(section_name, id), tags:event_vendor_tags(tags(name))"
    )
    .eq("event_id", displayData.id);

  const eventVendors: EventVendorData[] = eventVendorData || [];

  const tableDataPromise = eventVendors.map(async (eventVendor) => {
    const avatar = await getProfileAvatar(eventVendor.vendor.avatar_url);
    return {
      avatar_url: avatar,
      name: `${eventVendor.vendor.first_name} ${eventVendor.vendor.last_name}`,
      section: eventVendor.table.section_name as string,
      payment_status: eventVendor.payment_status,
      application_status: eventVendor.application_status,
      tags: eventVendor.tags.flatMap((tag) => tag.tags.name),
      vendor_info: eventVendor,
    };
  });
  const vendorsTableData = await Promise.all(tableDataPromise);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <DataTable
        columns={columns}
        data={vendorsTableData || []}
        eventData={displayData}
        tags={eventTags}
      />
    </div>
  );
}
