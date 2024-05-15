import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import VendorsChart from "./VendorsChart";
import { TagData } from "../../vendors/types";

export type VendorBreakdownData = {
  name: string;
  vendors: number;
}[];

export default async function VendorBreakdown({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  const { data: vendorTagData } = await supabase
    .from("event_vendor_tags")
    .select("tags(name)")
    .eq("event_id", event.id);

  const eventTags = tagsData as unknown as TagData[];
  const eventVendorTags = vendorTagData as unknown as TagData[];

  const vendorDataMap = new Map<string, number>();
  eventTags.map((tag) => {
    vendorDataMap.set(tag.tags.name, 0);
  });

  eventVendorTags.map((vendor) => {
    vendorDataMap.set(
      vendor.tags.name,
      vendorDataMap.has(vendor.tags.name)
        ? vendorDataMap.get(vendor.tags.name)! + 1
        : 0
    );
  });

  const vendorBreakdownData: VendorBreakdownData = [];
  vendorDataMap.forEach((value, key) => {
    vendorBreakdownData.push({
      name: key,
      vendors: value,
    });
  });

  return <VendorsChart vendorData={vendorBreakdownData} />;
}
