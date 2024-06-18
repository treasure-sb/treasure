import { columns } from "./table/VendorDataColumns";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { EventVendorData, TagData } from "../../types";
import { EventDisplayData } from "@/types/event";
import createSupabaseServerClient from "@/utils/supabase/server";
import DataTable from "./table/DataTable";

export default async function VerifiedVendors({
  event,
}: {
  event: EventDisplayData;
}) {
  const supabase = await createSupabaseServerClient();

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  const eventTagsData = tagsData as unknown as TagData[];
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
    <div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Vendor Applications{" "}
          <span className="text-muted-foreground">{eventVendors.length}</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={vendorsTableData || []}
        eventData={event}
        tags={eventTags}
      />
    </div>
  );
}
