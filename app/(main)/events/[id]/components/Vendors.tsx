import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Vendors({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();

  // @ts-ignore
  const vendors: Tables<"profiles">[] = event.vendors;
  const vendorsWithPublicUrls = await Promise.all(
    vendors.map(async (vendor: any) => {
      let {
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
                  <Avatar className="h-24 w-24 m-auto">
                    <AvatarImage src={vendor.vendorPublicUrl} />
                    <AvatarFallback>
                      {vendor.first_name[0]}
                      {vendor.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <span>@{vendor.username}</span>
              </div>
            ))}
          </div>
          <Separator />
        </>
      ) : null}
    </>
  );
}
