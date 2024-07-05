import { DataTable } from "./table/DataTable";
import { TempVendor, columns } from "./table/Columns";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import createSupabaseServerClient from "@/utils/supabase/server";

type TempVendorData = Tables<"temporary_vendors"> & {
  vendor: Tables<"temporary_profiles_vendors">;
} & {
  tag: Tables<"tags">;
};

type TagIDData = {
  tags: Tables<"tags">;
};

export default async function TempVendors({
  event,
}: {
  event: EventDisplayData;
}) {
  const supabase = await createSupabaseServerClient();

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", event.id);

  const eventTagsData = tagsData as unknown as TagIDData[];
  const eventTags: Tables<"tags">[] = eventTagsData.map((tag) => tag.tags);

  const { data: tempVendorsData } = await supabase
    .from("temporary_vendors")
    .select("*, vendor:temporary_profiles_vendors(*), tag:tags(*)")
    .eq("event_id", event.id);

  const tempVendors: TempVendorData[] = tempVendorsData || [];

  const tableDataPromise: Promise<TempVendor>[] = tempVendors.map(
    async (tempVendor) => {
      const vendor = tempVendor.vendor;
      const avatar = await getProfileAvatar(vendor.avatar_url);
      return {
        id: vendor.id,
        avatar_url: avatar,
        email: vendor.email,
        instagram: vendor.instagram,
        business_name: vendor.business_name,
        tag: tempVendor.tag.name,
      };
    }
  );

  const tableData = await Promise.all(tableDataPromise);

  return (
    <div>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Temporary Vendors{" "}
          <span className="text-muted-foreground">{tableData.length}</span>
        </h2>
      </div>
      <DataTable
        columns={columns}
        data={tableData}
        event={event}
        tags={eventTags}
      />
    </div>
  );
}
