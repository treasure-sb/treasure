import { EventVendorProfile } from "../../page";
import { DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  sendVendorAppAcceptedEmail,
  sendVendorAppRejectedEmail,
} from "@/lib/actions/emails";
import { EventDisplayData } from "@/types/event";
import { VendorAppAcceptedEmailProps } from "@/emails/VendorAppAccepted";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { VendorAppRejectedEmailProps } from "@/emails/VendorAppRejected";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Tables } from "@/types/supabase";
import Link from "next/link";

export default function VendorDialogContent({
  vendor,
  avatarUrl,
  eventData,
}: {
  vendor: EventVendorProfile;
  avatarUrl: string;
  eventData: EventDisplayData;
}) {
  const [message, setMessage] = useState("");
  const profile = vendor.vendor;
  const table = vendor.table;
  const {
    inventory,
    comments,
    table_quantity,
    vendors_at_table,
    event_id,
    vendor_id,
    application_status,
  } = vendor;
  const { name: eventName, publicPosterUrl: posterUrl } = eventData;
  const { refresh } = useRouter();

  const acceptVendor = async () => {
    const supabase = await createClient();
    await supabase
      .from("event_vendors")
      .update({ application_status: "ACCEPTED" })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);

    const { data } = await createCheckoutSession({
      event_id,
      ticket_id: table.id,
      ticket_type: "TABLE",
      user_id: profile.id,
      quantity: table_quantity,
    });

    const checkoutSession: Tables<"checkout_sessions"> = data?.[0] || {};

    const vendorAcceptedEmailProps: VendorAppAcceptedEmailProps = {
      eventName,
      posterUrl,
      message,
      checkoutSessionId: checkoutSession.id,
    };

    if (profile.email) {
      await sendVendorAppAcceptedEmail(profile.email, vendorAcceptedEmailProps);
    }
    refresh();
  };

  const rejectVendor = async () => {
    const supabase = await createClient();
    await supabase
      .from("event_vendors")
      .update({ application_status: "REJECTED" })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);

    const vendorRejectedEmailProps: VendorAppRejectedEmailProps = {
      eventName,
      posterUrl,
      message,
    };

    if (profile.email) {
      await sendVendorAppRejectedEmail(profile.email, vendorRejectedEmailProps);
    }
    refresh();
  };

  return (
    <DialogContent className="h-[70%]">
      <div className="flex flex-col justify-between h-full text-sm md:text-base overflow-scroll scrollbar-hidden">
        <div>
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
              <Avatar className="w-12 h-12 md:w-24 md:h-24 mt-8">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback />
              </Avatar>
              <Link target="_blank" href={`/${profile.username}`}>
                <Button variant={"ghost"}>View Profile</Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <p>
              {table.section_name}, {vendors_at_table} vendors at table
            </p>
            <p>Qty: {table_quantity}</p>
          </div>
          <Separator className="my-2" />
        </div>

        {application_status === "PENDING" ? (
          <div>
            <Textarea
              onChange={(e) => setMessage(e.target.value)}
              className="w-[90%] m-auto"
              rows={4}
              placeholder="Message to the Vendor... (Optional)"
            />
            <h1 className="text-gray-400 text-xs md:text-sm my-4">
              Once accepted, the vendor will receive an email to purchase their
              table.
            </h1>
            <div className="flex space-x-2">
              <Button
                onClick={async () => await acceptVendor()}
                className="w-full"
              >
                Accept
              </Button>
              <Button
                onClick={async () => await rejectVendor()}
                className="w-full"
                variant={"destructive"}
              >
                Reject
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}
