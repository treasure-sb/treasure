import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { VendorApplications } from "./components/vendor_applications/VendorApplications";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { EventVendorData, TagNameData } from "./types";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import TabState from "./components/TabState";
import VendorAssignment from "./components/assignments/VendorAssignment";
import TempVendors from "./components/temp_vendors/TempVendors";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Vendor } from "./components/vendor_applications/table/VendorDataColumns";

export default async function Page({
  params: { name },
  searchParams: { user },
}: {
  params: { name: string };
  searchParams: { user?: string };
}) {
  const { event, eventError } = await getEventFromCleanedName(name);

  if (eventError) {
    redirect("/host/events");
  }

  const displayData = await getEventDisplayData(event);

  const supabase = await createSupabaseServerClient();
  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  const eventTagsData = tagsData as unknown as TagNameData[];
  const eventTags = eventTagsData.map((tag) => tag.tags.name);

  const { data: eventVendorData } = await supabase
    .from("event_vendors")
    .select(
      "*, vendor:profiles(*, links(username, application)), table:tables(section_name, id), tags:event_vendor_tags(tags(name))"
    )
    .eq("event_id", event.id);

  const eventVendors: EventVendorData[] = eventVendorData || [];

  const tableDataPromise = eventVendors.map(async (eventVendor) => {
    const avatar = await getProfileAvatar(eventVendor.vendor.avatar_url);
    return {
      username: eventVendor.vendor.username,
      avatar_url: avatar,
      name: `${eventVendor.vendor.first_name} ${eventVendor.vendor.last_name}`,
      section: eventVendor.table.section_name as string,
      payment_status: eventVendor.payment_status,
      application_status: eventVendor.application_status,
      tags: eventVendor.tags.flatMap((tag) => tag.tags.name),
      vendor_info: { ...eventVendor, publicAvatarUrl: avatar },
    };
  });
  const vendorsTableData: Vendor[] = await Promise.all(tableDataPromise);

  return (
    <div className="max-w-7xl mx-auto">
      <TabState vendorData={vendorsTableData}>
        <VendorApplications
          event={displayData}
          vendorData={vendorsTableData}
          eventTags={eventTags}
        />
        <TempVendors event={displayData} />
        <VendorAssignment event={displayData} />
      </TabState>
    </div>
  );
}
