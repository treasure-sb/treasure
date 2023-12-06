import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import InviteLink from "./InviteLink";
import { Tables } from "@/types/supabase";

const vendorsWithAvatars = async (vendors: any) => {
  const supabase = await createSupabaseServerClient();
  const vendorAvatarPromiseMap = vendors.map(
    async (vendor: Tables<"profiles">) => {
      let {
        data: { publicUrl: vendorPublicUrl },
      } = await supabase.storage
        .from("avatars")
        .getPublicUrl(vendor.avatar_url);
      return {
        ...vendor,
        vendorPublicUrl,
      };
    }
  );
  return Promise.all(vendorAvatarPromiseMap);
};

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;

  // get vendors for event
  const { data: vendorData, error: vendorError } = await supabase
    .from("event_vendors")
    .select("profiles(*)")
    .eq("event_id", event_id);

  const vendors = vendorData?.map((data) => data.profiles);

  let publicVendors = [];
  if (vendorData) {
    publicVendors = await vendorsWithAvatars(vendors);
  }

  // get vendor applications for event
  const { data: vendorApplicationData, error: vendorApplicationError } =
    await supabase
      .from("vendor_applications")
      .select("profiles(*)")
      .eq("event_id", event_id);

  const vendorApplications = vendorApplicationData?.map(
    (data) => data.profiles
  );

  let publicApplications = [];
  if (vendorApplicationData) {
    publicApplications = await vendorsWithAvatars(vendorApplications);
  }

  return (
    <main className="max-w-xl m-auto w-full">
      <h1 className="font-semibold text-xl mb-6">Vendor List</h1>
      {publicVendors.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex gap-2 flex-wrap mb-10">
          {publicVendors.map((vendor: any) => (
            <div className="flex flex-col items-center">
              <div
                key={vendor.id}
                className="h-28 w-28 rounded-full overflow-hidden mt-2"
              >
                <Link href={`/users/${vendor.id}`}>
                  <Image
                    className="block w-full h-full object-cover"
                    alt="avatar"
                    src={vendor.vendorPublicUrl}
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
              <h1>@{vendor.username}</h1>
            </div>
          ))}
        </div>
      )}
      <h1 className="font-semibold text-xl mt-10 mb-6">Vendor Applications</h1>
      {publicApplications.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {publicApplications.map((vendor: any) => (
            <div className="flex flex-col items-center">
              <div
                key={vendor.id}
                className="h-28 w-28 rounded-full overflow-hidden mt-2"
              >
                <Link href={`/users/${vendor.id}`}>
                  <Image
                    className="block w-full h-full object-cover"
                    alt="avatar"
                    src={vendor.vendorPublicUrl}
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
              <h1>@{vendor.username}</h1>
            </div>
          ))}
        </div>
      )}
      <InviteLink event_id={event_id} />
    </main>
  );
}
