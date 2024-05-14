import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Tables } from "@/types/supabase";
import { VendorAppAcceptedEmailProps } from "@/lib/emails/VendorAppAccepted";
import { VendorAppRejectedEmailProps } from "@/lib/emails/VendorAppRejected";
import {
  sendVendorAppAcceptedEmail,
  sendVendorAppRejectedEmail,
} from "@/lib/actions/emails";
import { useRouter } from "next/navigation";
import { EventVendorData } from "../../types";
import { EventDisplayData } from "@/types/event";
import { sendSMS } from "@/lib/actions/twilio";

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
    const successfullySentEmail = await handleSendAcceptedEmail(
      checkoutSession.id
    );

    if (!successfullySentEmail) {
      handleError("Failed to send vendor email. Please try again.");
      return;
    }

    const successfullySentSMS = await handleSendSMS(checkoutSession.id);
    if (!successfullySentSMS) {
      handleError("Failed to send SMS. Please try again.");
    }

    const { error: vendorUpdateError } = await supabase
      .from("event_vendors")
      .update({ application_status: "ACCEPTED" })
      .eq("vendor_id", vendor_id)
      .eq("event_id", event_id);

    if (vendorUpdateError) {
      handleError("Failed to update vendor status. Please try again.");
      return;
    }

    toast.dismiss();
    toast.success("Vendor Accepted!");
    setLoading(false);
    refresh();
  };

  const handleSendSMS = async (checkoutSessionId: string) => {
    const checkoutUrl = `https://www.ontreasure.xyz/checkout/${checkoutSessionId}`;
    const smsMessage = message
      ? `Your application for ${eventName} has been accepted!\n\nMessage from the host: ${message}\n\nPurchase your table here: ${checkoutUrl}`
      : `Your application for ${eventName} has been accepted!\n\nPurchase your table here: ${checkoutUrl}`;
    const { success: smsSuccess } = await sendSMS(
      application_phone,
      smsMessage
    );

    return smsSuccess;
  };

  const handleSendAcceptedEmail = async (checkoutSessionId: string) => {
    const vendorAcceptedEmailProps: VendorAppAcceptedEmailProps = {
      eventName,
      posterUrl,
      message,
      checkoutSessionId: checkoutSessionId,
    };

    const { error: sendVendorEmailError } = await sendVendorAppAcceptedEmail(
      application_email,
      vendorAcceptedEmailProps
    );

    return !sendVendorEmailError;
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

    const successfullySentEmail = await handleSendRejectedEmail();
    if (!successfullySentEmail) {
      handleError("Failed to send vendor email. Please try again.");
      return;
    }

    toast.dismiss();
    toast.success("Vendor Rejected!");
    setLoading(false);
    refresh();
  };

  const handleSendRejectedEmail = async () => {
    const vendorRejectedEmailProps: VendorAppRejectedEmailProps = {
      eventName,
      posterUrl,
      message,
    };

    const { error: sendVendorEmailError } = await sendVendorAppRejectedEmail(
      application_email,
      vendorRejectedEmailProps
    );

    return !sendVendorEmailError;
  };

  const handleError = (message: string) => {
    toast.dismiss();
    toast.error(message);
    setLoading(false);
  };

  return (
    <div className="bg-secondary py-2 px-2 rounded-sm relative mt-3">
      <div className="rounded-full bg-red-600 absolute w-4 h-4 -top-1 -right-0 animate-pulse"></div>
      <Textarea
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-2 sm:px-4"
        rows={3}
        placeholder="Write Message to the Vendor... (Optional)"
      />
      <h1 className="text-gray-300 text-xs md:text-sm my-4 mx-2">
        Once accepted, the vendor will receive an email to purchase their table.
      </h1>
      <div className="flex space-x-2">
        <Button
          onClick={async () => await rejectVendor()}
          disabled={loading}
          className="w-full text-black"
          variant={"destructive"}
        >
          Reject
        </Button>
        <Button
          onClick={async () => await acceptVendor()}
          disabled={loading}
          className="w-full"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
