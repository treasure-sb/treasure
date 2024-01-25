import { EventVendorProfile } from "../page";
import { DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function VendorDialogContent({
  vendor,
  avatarUrl,
}: {
  vendor: EventVendorProfile;
  avatarUrl: string;
}) {
  const profile = vendor.vendor;
  const {
    inventory,
    comments,
    table_quantity: tableQuantity,
    vendors_at_table: vendorsAtTable,
    event_id: eventId,
    vendor_id: vendorId,
    application_status: applicationStatus,
  } = vendor;

  const { refresh } = useRouter();

  const acceptVendor = async () => {
    const supabase = await createClient();
    await supabase
      .from("event_vendors")
      .update({ application_status: "ACCEPTED" })
      .eq("vendor_id", vendorId)
      .eq("event_id", eventId)
      .single();
    refresh();
  };

  return (
    <DialogContent className="h-[70%] flex flex-col justify-between">
      <div className="flex flex-col justify-between h-[80%]">
        <div className="flex justify-between">
          <div className="space-y-4">
            <h1 className="text-xl font-semibold">Review Information</h1>
            <p>
              <span className="text-primary">First Name:</span>{" "}
              {profile.first_name}
            </p>
            <p>
              <span className="text-primary">Last Name:</span>{" "}
              {profile.last_name}
            </p>
            <p>
              <span className="text-primary">Email:</span> {profile?.email}
            </p>
            <p>
              <span className="text-primary">Business Name:</span>{" "}
              {profile?.business_name || "N/A"}
            </p>
            <p>
              <span className="text-primary">Inventory:</span> {inventory}
            </p>
            <p>
              <span className="text-primary">Additional Comments:</span>{" "}
              {comments || "N/A"}
            </p>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <Avatar className="w-24 h-24 mt-8">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback />
            </Avatar>
            <Link target="_blank" href={`/${profile.username}`}>
              <Button variant={"ghost"}>View Profile</Button>
            </Link>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <p>{vendorsAtTable} vendors at table</p>
            <p>Qty: {tableQuantity}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-end">${tableQuantity}</div>
        </div>
      </div>
      {applicationStatus === "ACCEPTED" ? null : (
        <>
          <h1 className="text-gray-400 text-sm">
            Once accepted, the vendor will receive an email to purchase their
            table.
          </h1>
          <div className="flex space-x-2">
            <Button onClick={() => acceptVendor()} className="w-full">
              Accept
            </Button>
            <Button className="w-full" variant={"destructive"}>
              Reject
            </Button>
          </div>
        </>
      )}
    </DialogContent>
  );
}
