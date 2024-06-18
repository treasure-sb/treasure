import { getPublicVenueMapUrl } from "@/lib/helpers/events";
import { eventDisplayData } from "@/lib/helpers/events";
import { columns } from "./table/VendorDataColumns";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import DataTable from "./table/DataTable";
import AssignForm from "./AssignForm";
import { EventDisplayData } from "@/types/event";

const getVendorPublicUrl = async (vendors: any[]) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.profiles.avatar_url);
      return { ...vendor, vendorPublicUrl: publicUrl };
    })
  );
};

const getTempVendorPublicUrl = async (vendors: any[]) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.temporary_profiles.avatar_url);
      return { ...vendor, vendorPublicUrl: publicUrl };
    })
  );
};

export default async function VendorAssignment({
  event,
}: {
  event: EventDisplayData;
}) {
  const publicVenueMapUrl = await getPublicVenueMapUrl(event);
  const supabase = await createSupabaseServerClient();

  const { data: vendorsData } = await supabase
    .from("event_vendors")
    .select("profiles(*),*,tables(*)")
    .eq("event_id", event.id)
    .eq("payment_status", "PAID");

  const { data: tempVendorData } = await supabase
    .from("temporary_vendors")
    .select("temporary_profiles(*),*")
    .eq("event_id", event.id);

  let vendors = vendorsData ? vendorsData : [];
  let tempVendors = tempVendorData ? tempVendorData : [];

  const vendorsWithPublicUrls = await getVendorPublicUrl(vendors);
  const tempVendorsWithPublicUrls = await getTempVendorPublicUrl(tempVendors);

  const eData = (await eventDisplayData([event]))[0];

  const tableDataPromise = vendorsWithPublicUrls.map(async (eventVendor) => {
    return {
      avatar_url: eventVendor.vendorPublicUrl,
      name: `${eventVendor.profiles.first_name} ${eventVendor.profiles.last_name}`,
      section: eventVendor.tables.section_name,
      type: "Verified",
      assignment: eventVendor.assignment ? eventVendor.assignment : "N/A",
      vendor_id: eventVendor.profiles.id,
    };
  });
  const vendorsTableData = await Promise.all(tableDataPromise);

  const tableDataPromiseTempVendors = tempVendorsWithPublicUrls.map(
    async (eventVendor) => {
      return {
        avatar_url: eventVendor.vendorPublicUrl,
        name: `${eventVendor.temporary_profiles.business_name}`,
        section: eventVendor.table_id ? eventVendor.table_id : "N/A",
        type: "Temporary",
        assignment: eventVendor.assignment ? eventVendor.assignment : "N/A",
        vendor_id: eventVendor.temporary_profiles.id,
      };
    }
  );
  const tempVendorsTableData = await Promise.all(tableDataPromiseTempVendors);

  const tableData = [...vendorsTableData, ...tempVendorsTableData];
  const numTables =
    vendorsWithPublicUrls.length > 0
      ? vendorsWithPublicUrls[0]?.tables.quantity
      : 50;

  return (
    <div>
      <h3 className="font-semibold text-2xl">Vendor Assignment</h3>
      <div className="max-w-4xl mx-auto py-4 gap-4 items-center flex flex-col">
        <Image
          className="rounded-xl mb-6 lg:mb-0"
          alt="venue map image"
          src={publicVenueMapUrl}
          width={500}
          height={200}
        />
        <AssignForm
          event_id={event.id}
          vendors={tableData}
          numTables={numTables}
        />
        <DataTable columns={columns} data={tableData} eventData={eData} />
      </div>
    </div>
  );
}
