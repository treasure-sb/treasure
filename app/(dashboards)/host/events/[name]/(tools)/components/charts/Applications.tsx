import createSupabaseServerClient from "@/utils/supabase/server";
import ApplicationsChart from "./ApplicationsChart";
import { Tables } from "@/types/supabase";

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

export default async function Applications({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: vendorData } = await supabase
    .from("event_vendors")
    .select("application_status")
    .eq("event_id", event.id);

  const eventVendors: ApplicationFetchData[] = vendorData || [];

  const vendorDataMap = new Map<VendorStatus, number>(
    VENDOR_STATUSES.map((status) => [status, 0])
  );

  eventVendors.map((vendor) => {
    vendorDataMap.set(
      vendor.application_status,
      vendorDataMap.has(vendor.application_status)
        ? vendorDataMap.get(vendor.application_status)! + 1
        : 0
    );
  });

  const applicationData: ApplicationData = [];
  vendorDataMap.forEach((value, key) => {
    applicationData.push({
      status: key,
      vendors: value,
    });
  });

  return (
    <div className="h-80 md:h-[29rem] col-span-1 bg-[#0d0d0c] rounded-md px-6 p-4 border-[1px] border-secondary">
      <h3 className="text-2xl font-semibold mb-4">Applications</h3>
      <ApplicationsChart applicationData={applicationData} />
    </div>
  );
}
