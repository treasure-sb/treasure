import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import InviteLink from "./components/InviteLink";
import AcceptDeclineButton from "./components/AcceptDeclineButton";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// maps each vendor to their profile picture
const vendorsWithAvatars = async (vendors: any) => {
  const supabase = await createSupabaseServerClient();
  const vendorAvatarPromiseMap = vendors.map(async (vendor: any) => {
    let {
      data: { publicUrl: vendorPublicUrl },
    } = await supabase.storage
      .from("avatars")
      .getPublicUrl(vendor.profiles.avatar_url);
    return {
      ...vendor,
      vendorPublicUrl,
    };
  });
  return Promise.all(vendorAvatarPromiseMap);
};

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const eventCleanedName = params.id;
  const { event, eventError } = await getEventFromCleanedName(eventCleanedName);
  if (eventError) {
    redirect("/events");
  }

  // get vendors for event along with their profile pictures
  const { data: vendorData, error: vendorError } = await supabase
    .from("event_vendors")
    .select("profiles(*)")
    .eq("event_id", event.id);

  const publicVendors = (await vendorsWithAvatars(vendorData)) || [];

  // get vendor applications for event along with their profile pictures
  const { data: vendorApplicationData, error: vendorApplicationError } =
    await supabase
      .from("vendor_applications")
      .select("*,profiles(*)")
      .eq("event_id", event.id);

  const vendorApplications = vendorApplicationData?.map(
    (data) => data.profiles
  );

  const publicApplications =
    (await vendorsWithAvatars(vendorApplicationData)) || [];

  // have to handle this if user is logged in or not
  const handleAccept = async (vendor_id: string) => {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event_vendors")
      .insert([{ event_id: event.id, vendor_id: vendor_id }]);
    await supabase
      .from("vendor_applications")
      .update({ status: 2 })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event.id);
    revalidatePath(`/events/${eventCleanedName}/vendor-list`);
  };

  const handleDecline = async (vendor_id: string, event_id: string) => {
    "use server";
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("vendor_applications")
      .update({ status: 1 })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);
  };

  return (
    <main className="max-w-xl m-auto w-full">
      <div className="flex w-full justify-between align-middle mb-6">
        <h1 className="font-semibold text-xl my-auto">Vendor List</h1>
        <InviteLink event_url={eventCleanedName} />
      </div>
      {publicVendors.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex gap-2 flex-wrap mb-10">
          {publicVendors.map((vendor: any) => (
            <div className="flex flex-col space-y-2">
              <Link href={`/users/${vendor.profiles.username}`}>
                <Avatar className="h-24 w-24 m-auto">
                  <AvatarImage src={vendor.vendorPublicUrl} />
                  <AvatarFallback>
                    {vendor.profiles.first_name[0]}
                    {vendor.profiles.last_name[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <h1 className="text-center">{vendor.profiles.username}</h1>
            </div>
          ))}
        </div>
      )}
      <h1 className="font-semibold text-xl mt-10 mb-6">Vendor Applications</h1>
      {publicApplications.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex flex-col gap-2 flex-wrap">
          {publicApplications.map((vendor: any) => (
            <>
              {vendor.status === 0 ? (
                <div className="flex gap-4 items-center justify-between">
                  <div className="flex flex-col space-y-2">
                    <Link href={`/users/${vendor.profiles.username}`}>
                      <Avatar className="h-24 w-24 m-auto">
                        <AvatarImage src={vendor.vendorPublicUrl} />
                        <AvatarFallback>
                          {vendor.profiles.first_name[0]}
                          {vendor.profiles.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <h1 className="text-center">{vendor.profiles.username}</h1>
                  </div>
                  <div className="flex flex-col my-auto w-full">
                    <h1 className="font-semibold">Contact</h1>
                    <h2 className="text-sm">{vendor.contact}</h2>
                    <h1 className="mt-4 font-semibold">Collection</h1>
                    <h2 className="text-sm">{vendor.collection_type}</h2>
                  </div>
                  <div>
                    <AcceptDeclineButton
                      handleClick={handleAccept}
                      vendor_id={vendor.profiles.id}
                      event_id={event.id}
                      type="0"
                    />
                    <AcceptDeclineButton
                      handleClick={handleDecline}
                      vendor_id={vendor.profiles.id}
                      event_id={event.id}
                      type="1"
                    />
                  </div>
                </div>
              ) : null}
            </>
          ))}
        </div>
      )}
    </main>
  );
}
