import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Tables } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { EventVendorData } from "../../types";
import { EventDisplayData } from "@/types/event";
import { sendReminderVendorAppAcceptedSMS } from "@/lib/sms";
import { VendorAppAcceptedEmailProps } from "@/emails/VendorAppAccepted";
import { sendReminderVendorAppAcceptedEmail } from "@/lib/actions/emails";

export default function AcceptedOptions({
  vendorData,
  eventData,
  closeDialog,
}: {
  vendorData: EventVendorData;
  eventData: EventDisplayData;
  closeDialog: () => void;
}) {
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

  const remindVendorToPay = async () => {
    setLoading(true);
    toast.loading("Sending reminder...");

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
    const successfullySentEmail = await handleSendRemindEmail(
      checkoutSession.id
    );

    if (!successfullySentEmail) {
      handleError("Failed to send vendor email. Please try again.");
      return;
    }

    const res = await sendReminderVendorAppAcceptedSMS(
      application_phone,
      checkoutSession.id,
      "",
      eventName
    );

    toast.dismiss();
    toast.success("Reminder sent!");
    setLoading(false);
    refresh();
    closeDialog();
  };

  const markAsPaid = async () => {
    toast.loading("Updating payment status...");
    const { error: updateVendorError } = await supabase
      .from("event_vendors")
      .update({ payment_status: "PAID" })
      .eq("event_id", event_id)
      .eq("vendor_id", vendorData.vendor_id);

    if (updateVendorError) {
      handleError("Error updating status. Please try again.");
      return;
    }

    toast.dismiss();
    toast.success("Payment status updated!");
    setLoading(false);
    refresh();
    closeDialog();
  };

  const handleSendRemindEmail = async (checkoutSessionId: string) => {
    const vendorAcceptedEmailProps: VendorAppAcceptedEmailProps = {
      eventName,
      posterUrl,
      message: "",
      checkoutSessionId: checkoutSessionId,
    };

    const { error: sendVendorEmailError } =
      await sendReminderVendorAppAcceptedEmail(
        application_email,
        vendorAcceptedEmailProps
      );

    return !sendVendorEmailError;
  };

  const handleError = (message: string) => {
    toast.dismiss();
    toast.error(message);
    setLoading(false);
  };

  return (
    <div className="flex space-x-2">
      <Button
        onClick={async () => remindVendorToPay()}
        disabled={loading}
        className="w-full text-black"
      >
        Remind to Pay
      </Button>
      <Button
        onClick={async () => markAsPaid()}
        variant={"secondary"}
        disabled={loading || vendorData.payment_status === "PAID"}
        className="w-full"
      >
        Mark as Paid
      </Button>
    </div>
  );
}
