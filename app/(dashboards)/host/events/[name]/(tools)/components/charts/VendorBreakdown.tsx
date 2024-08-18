import createSupabaseServerClient from "@/utils/supabase/server";
import VendorsChart from "./VendorsChart";
import { Tables } from "@/types/supabase";
import { TagNameData } from "../../vendors/types";
import ApplicationsChart from "./ApplicationsChart";
import { EventWithDates } from "@/types/event";
import { RoleMapKey } from "../../team/components/ListMembers";

export type VendorBreakdownData = {
  name: string;
  vendors: number;
}[];

const VENDOR_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
] as const;
type VendorStatus = (typeof VENDOR_STATUSES)[number];

type ApplicationFetchData = {
  application_status: VendorStatus;
};

export type ApplicationData = {
  status: VendorStatus;
  vendors: number;
}[];

const MutedVendorChart = () => (
  <div className="h-full flex items-center justify-center text-muted-foreground pb-20">
    Vendor data not available for your role
  </div>
);

export default async function VendorBreakdown({
  event,
  role,
}: {
  event: EventWithDates;
  role: RoleMapKey;
}) {
  const isScanner = role === "SCANNER";
  const vendorBreakdownData: VendorBreakdownData = [];
  const applicationData: ApplicationData = [];

  if (!isScanner) {
    const supabase = await createSupabaseServerClient();
    const { data: tagsData } = await supabase
      .from("event_tags")
      .select("tags(name)")
      .eq("event_id", event.id);

    const { data: vendorTagData } = await supabase
      .from("event_vendor_tags")
      .select("tags(name)")
      .eq("event_id", event.id);

    const eventTags = tagsData as unknown as TagNameData[];
    const eventVendorTags = vendorTagData as unknown as TagNameData[];

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

    vendorDataMap.forEach((value, key) => {
      vendorBreakdownData.push({
        name: key,
        vendors: value,
      });
    });

    const { data: vendorData } = await supabase
      .from("event_vendors")
      .select("application_status")
      .eq("event_id", event.id);

    const eventVendors: ApplicationFetchData[] = vendorData || [];

    const applicationDataMap = new Map<VendorStatus, number>(
      VENDOR_STATUSES.map((status) => [status, 0])
    );

    eventVendors.map((vendor) => {
      applicationDataMap.set(
        vendor.application_status,
        applicationDataMap.has(vendor.application_status)
          ? applicationDataMap.get(vendor.application_status)! + 1
          : 0
      );
    });

    applicationDataMap.forEach((value, key) => {
      applicationData.push({
        status: key,
        vendors: value,
      });
    });
  }

  return (
    <div
      className={`h-80 md:h-[29rem] col-span-3 bg-secondary dark:bg-[#0d0d0c] rounded-md p-6 py-4 pb-10 border-[1px] border-secondary ${
        isScanner ? "opacity-50" : ""
      }`}
    >
      <h3 className="text-2xl font-semibold mb-4">Vendor Breakdown</h3>
      {isScanner ? (
        <MutedVendorChart />
      ) : (
        <div className="flex flex-col md:flex-row h-[calc(100%-2rem)]">
          <div className="w-full md:w-[60%] h-full">
            <VendorsChart vendorData={vendorBreakdownData} />
          </div>
          <div className="w-full md:w-[40%] h-full">
            <ApplicationsChart applicationData={applicationData} />
          </div>
        </div>
      )}
    </div>
  );
}
