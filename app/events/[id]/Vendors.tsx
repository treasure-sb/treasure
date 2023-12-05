import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Vendors({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();

  // @ts-ignore
  const vendors = event.profiles;
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
      <h1 className="font-semibold text-2xl">Vendors</h1>
      <div className="flex flex-col gap-4 flex-wrap max-h-80 smScrollbar-hidden overflow-scroll py-3 sm:overflow-auto">
        {vendorsWithPublicUrls && vendorsWithPublicUrls.length > 0 ? (
          vendorsWithPublicUrls.map((vendor: any) => (
            <Link key={vendor.id} href={`/users/${vendor.id}`}>
              <div className="flex flex-col gap-1 justify-center align-middle">
                <div className="h-28 w-28 m-auto rounded-full overflow-hidden">
                  <Image
                    className="block w-full h-full object-cover"
                    alt="avatar"
                    src={vendor.vendorPublicUrl}
                    width={100}
                    height={100}
                  />
                </div>
                <h1 className="text-center text-sm">@{vendor.instagram}</h1>
              </div>
            </Link>
          ))
        ) : (
          <h1 className="text-center text-sm">Vendors Coming Soon!</h1>
        )}
      </div>
    </>
  );
}
