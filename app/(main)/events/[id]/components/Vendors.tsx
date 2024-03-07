import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Vendors({
  vendors,
}: {
  vendors: Tables<"profiles">[];
}) {
  const supabase = await createSupabaseServerClient();
  const vendorsWithPublicUrls = await Promise.all(
    vendors.map(async (vendor) => {
      const {
        data: { publicUrl: vendorPublicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.avatar_url);
      return {
        ...vendor,
        vendorPublicUrl,
      };
    })
  );

  return (
    <>
      {vendorsWithPublicUrls && vendorsWithPublicUrls.length > 0 ? (
        <>
          <h1 className="font-semibold text-2xl">Vendors</h1>
          <div className="flex flex-col gap-4 flex-wrap max-h-80 smScrollbar-hidden overflow-scroll py-3 sm:overflow-auto">
            {vendorsWithPublicUrls.map((vendor: any) => (
              <div className="flex flex-col space-y-1 items-center">
                <Link href={`/${vendor.username}`}>
                  <Avatar className="h-20 w-20 m-auto">
                    <AvatarImage src={vendor.vendorPublicUrl} />
                    <AvatarFallback>
                      {vendor.first_name[0]}
                      {vendor.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="items-center text-center">
                  <div className="font-semibold text-base">
                    {vendor.business_name
                      ? vendor.business_name
                      : vendor.first_name + " " + vendor.last_name}
                  </div>
                  <div className="text-sm ">@{vendor.username}</div>
                </div>
              </div>
            ))}
          </div>
          <Separator />
        </>
      ) : null}
    </>
  );
}
