import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";

const getVendorsWithPublicUrl = async (
  vendors: Tables<"temporary_profiles">[] | Tables<"profiles">[]
) => {
  const supabase = await createSupabaseServerClient();
  return Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.avatar_url);
      return { ...vendor, vendorPublicUrl: publicUrl };
    })
  );
};

export default async function Vendors({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: vendorsData } = await supabase
    .from("event_vendors")
    .select("profiles(*)")
    .eq("event_id", event.id)
    .eq("payment_status", "PAID");

  const vendors: Tables<"profiles">[] =
    vendorsData?.map((vendor) => vendor.profiles).flat() || [];

  const { data: tempVendorData } = await supabase
    .from("temporary_vendors")
    .select("temporary_profiles(*)")
    .eq("event_id", event.id);

  const tempVendors: Tables<"temporary_profiles">[] =
    tempVendorData?.map((vendor) => vendor.temporary_profiles).flat() || [];

  const vendorsWithPublicUrls = (await getVendorsWithPublicUrl(
    vendors
  )) as (Tables<"profiles"> & { vendorPublicUrl: string })[];
  const tempVendorsWithPublicUrls = await getVendorsWithPublicUrl(tempVendors);

  return (
    (vendorsWithPublicUrls?.length > 0 ||
      tempVendorsWithPublicUrls?.length > 0) && (
      <>
        <h3 className="font-semibold text-xl mb-4">Vendors</h3>
        <div className="flex flex-col gap-4 flex-wrap max-h-80 smScrollbar-hidden overflow-scroll py-3 sm:overflow-auto">
          {vendorsWithPublicUrls &&
            vendorsWithPublicUrls.map((vendor) => (
              <div className="flex flex-col space-y-1 items-center">
                <Link href={`/${vendor.username}`}>
                  <Avatar className="h-20 w-20 m-auto">
                    <AvatarImage src={vendor.vendorPublicUrl} />
                    <AvatarFallback>
                      {`${vendor.first_name[0]}${vendor.last_name[0]}`}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="items-center text-center">
                  <div className="font-semibold text-base">
                    {vendor.business_name
                      ? vendor.business_name
                      : vendor.first_name + " " + vendor.last_name}
                  </div>
                  <p className="text-sm ">@{vendor.username}</p>
                </div>
              </div>
            ))}
          {tempVendorsWithPublicUrls &&
            tempVendorsWithPublicUrls.map((vendor) => (
              <div className="flex flex-col space-y-1 items-center">
                <Link href={`/${vendor.username}?type=t`}>
                  <Avatar className="h-20 w-20 m-auto">
                    <AvatarImage src={vendor.vendorPublicUrl} />
                    <AvatarFallback />
                  </Avatar>
                </Link>
                <div className="items-center text-center">
                  <div className="font-semibold text-base">
                    {vendor.business_name}
                  </div>
                  <p className="text-sm">@{vendor.username}</p>
                </div>
              </div>
            ))}
        </div>
        <Separator />
      </>
    )
  );
}
