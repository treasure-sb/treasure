import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import InviteLink from "@/components/events/organizer/InviteLink";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;

  const { data: vendorData, error } = await supabase
    .from("event_vendors")
    .select("profiles(*)")
    .eq("event_id", event_id);
  let vendorsWithPublicUrls = [];
  if (vendorData) {
    vendorsWithPublicUrls = await Promise.all(
      vendorData.map(async (vendor: any) => {
        let {
          data: { publicUrl: vendorPublicUrl },
        } = await supabase.storage
          .from("avatars")
          .getPublicUrl(vendor.profiles.avatar_url);
        return {
          ...vendor,
          vendorPublicUrl,
        };
      })
    );
  }

  return (
    <main className="max-w-lg m-auto w-full">
      <h1 className="font-semibold text-xl">Vendor List</h1>
      {vendorsWithPublicUrls.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex space-x-2 flex-wrap">
          {vendorsWithPublicUrls.map((vendor: any) => (
            <div
              key={vendor.id}
              className="h-28 w-28 rounded-full overflow-hidden mt-2"
            >
              <Link href={`/users/${vendor.profiles.id}`}>
                <Image
                  className="block w-full h-full object-cover"
                  alt="avatar"
                  src={vendor.vendorPublicUrl}
                  width={100}
                  height={100}
                />
              </Link>
            </div>
          ))}
        </div>
      )}
      <InviteLink event_id={event_id} />
    </main>
  );
}
