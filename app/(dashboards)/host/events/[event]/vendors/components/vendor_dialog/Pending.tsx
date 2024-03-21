import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Tables } from "@/types/supabase";
import { VendorAppAcceptedEmailProps } from "@/emails/VendorAppAccepted";
import { VendorAppRejectedEmailProps } from "@/emails/VendorAppRejected";
import {
  sendVendorAppAcceptedEmail,
  sendVendorAppRejectedEmail,
} from "@/lib/actions/emails";
import { useRouter } from "next/navigation";
import { EventVendorData } from "../../page";
import { EventDisplayData } from "@/types/event";

export default function Pending({
  vendorData,
  eventData,
}: {
  vendorData: EventVendorData;
  eventData: EventDisplayData;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { refresh } = useRouter();

  const {
    table_quantity,
    event_id,
    vendor_id,
    application_email,
    application_phone,
  } = vendorData;
  const { name: eventName, publicPosterUrl: posterUrl } = eventData;
  const table = vendorData.table;
  const profile = vendorData.vendor;

  const acceptVendor = async () => {
    setLoading(true);
    toast.loading("Accepting Vendor...");

    const { error: vendorUpdateError } = await supabase
      .from("event_vendors")
      .update({ application_status: "ACCEPTED" })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);

    if (vendorUpdateError) {
      handleError("Failed to update vendor status. Please try again.");
      return;
    }

    const { data: checkoutSessionData, error: checkoutSessionError } =
      await createCheckoutSession({
        event_id,
        ticket_id: table.id,
        ticket_type: "TABLE",
        user_id: profile.id,
        quantity: table_quantity,
      });

    if (checkoutSessionError || !checkoutSessionData?.length) {
      handleError("Failed to create checkout session. Please try again.");
      return;
    }

    const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData[0];
    const vendorAcceptedEmailProps: VendorAppAcceptedEmailProps = {
      eventName,
      posterUrl,
      message,
      checkoutSessionId: checkoutSession.id,
    };

    if (profile.email) {
      const { error: sendVendorEmailError } = await sendVendorAppAcceptedEmail(
        profile.email,
        vendorAcceptedEmailProps
      );

      if (sendVendorEmailError) {
        handleError("Failed to send vendor email. Please try again.");
        return;
      }
    }

    toast.dismiss();
    toast.success("Vendor Accepted!");
    setLoading(false);
    refresh();
  };

  const rejectVendor = async () => {
    setLoading(true);
    toast.loading("Rejecting Vendor...");

    const { error: vendorUpdateError } = await supabase
      .from("event_vendors")
      .update({ application_status: "REJECTED" })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);

    if (vendorUpdateError) {
      handleError("Failed to update vendor status. Please try again.");
      return;
    }

    const vendorRejectedEmailProps: VendorAppRejectedEmailProps = {
      eventName,
      posterUrl,
      message,
    };

    const { error: sendVendorEmailError } = await sendVendorAppRejectedEmail(
      application_email,
      vendorRejectedEmailProps
    );

    if (sendVendorEmailError) {
      handleError("Failed to send vendor email. Please try again.");
      return;
    }

    toast.dismiss();
    toast.success("Vendor Rejected!");
    setLoading(false);
    refresh();
  };

  const handleError = (message: string) => {
    toast.dismiss();
    toast.error(message);
    setLoading(false);
  };

  return (
    <div>
      <Textarea
        onChange={(e) => setMessage(e.target.value)}
        className="w-[90%] m-auto"
        rows={4}
        placeholder="Write Message to the Vendor... (Optional)"
      />
      <h1 className="text-gray-400 text-xs md:text-sm my-4">
        Once accepted, the vendor will receive an email to purchase their table.
      </h1>
      <div className="flex space-x-2">
        <Button
          onClick={async () => await acceptVendor()}
          disabled={loading}
          className="w-full"
        >
          Accept
        </Button>
        <Button
          onClick={async () => await rejectVendor()}
          disabled={loading}
          className="w-full"
          variant={"destructive"}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
