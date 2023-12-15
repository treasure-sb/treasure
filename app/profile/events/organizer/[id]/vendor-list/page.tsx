import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import InviteLink from "./InviteLink";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AcceptDeclineButton from "./AcceptDeclineButton";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getEventFromCleanedName } from "@/lib/helpers/events";

// maps each vendor to their profile picture
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

  const vendors = vendorData?.map((data) => data.profiles);
  const publicVendors = (await vendorsWithAvatars(vendors)) || [];

  // get vendor applications for event along with their profile pictures
  const { data: vendorApplicationData, error: vendorApplicationError } =
    await supabase
      .from("vendor_applications")
      .select("profiles(*)")
      .eq("event_id", event.id);

  const vendorApplications = vendorApplicationData?.map(
    (data) => data.profiles
  );
  const publicApplications =
    (await vendorsWithAvatars(vendorApplications)) || [];

  // have to handle this if user is logged in or not
  const handleAccept = async (vendor_id: string) => {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("event_vendors")
      .insert([{ event_id: event.id, vendor_id: vendor_id }]);
    await supabase
      .from("vendor_applications")
      .delete()
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
            <div className="flex flex-col space-y-1 items-center">
              <Link href={`/users/${vendor.username}`}>
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
      )}
      <h1 className="font-semibold text-xl mt-10 mb-6">Vendor Applications</h1>
      {publicApplications.length == 0 ? (
        <div className="text-lg">Your event currently has no vendors</div>
      ) : (
        <div className="flex flex-col gap-2 flex-wrap">
          {publicApplications.map((vendor: any) => (
            <div className="flex space-y-1 items-start justify-between">
              <div>
                <Link href={`/users/${vendor.username}`}>
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
              <div>
                <AcceptDeclineButton
                  handleClick={handleAccept}
                  vendor_id={vendor.id}
                  event_id={event.id}
                  type="0"
                />
                <AcceptDeclineButton
                  handleClick={handleDecline}
                  vendor_id={vendor.id}
                  event_id={event.id}
                  type="1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
