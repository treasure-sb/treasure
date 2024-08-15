import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Tables } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { EventVendorData } from "../../../types";
import { EventDisplayData } from "@/types/event";
import { sendReminderVendorAppAcceptedSMS } from "@/lib/sms";
import { VendorAppAcceptedEmailProps } from "@/emails/VendorAppAccepted";
import { sendReminderVendorAppAcceptedEmail } from "@/lib/actions/emails";
import MoveVendor from "./MoveVendor";

export type EventsInfo = {
  name: string;
  id: string;
  dates: { date: string; start_time: string; end_time: string }[];
  tables: { id: string; section_name: string }[];
};

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
  const [viewMoveVender, setViewMoveVender] = useState(false);
  const supabase = createClient();
  const { refresh } = useRouter();
  const [events, setEvents] = useState<EventsInfo[]>([
    {
      name: eventData.name,
      id: eventData.id,
      dates: eventData.dates,
      tables: [
        {
          section_name: vendorData.table.section_name,
          id: vendorData.table_id,
        },
      ],
    },
  ]);

  const { table_quantity, event_id, application_email, application_phone } =
    vendorData;
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

    if (checkoutSessionError || !checkoutSessionData) {
      handleError("Failed to create checkout session. Please try again.");
      return;
    }

    const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
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

  // TODO: fix using event_roles
  const moveVendors = async () => {
    const { data: eventsData, error } = await supabase
      .from("events")
      .select(
        "id, name, dates:event_dates(date, start_time, end_time), tables(id, section_name)"
      );

    setEvents(eventsData as EventsInfo[]);
    setViewMoveVender(true);
  };

  return (
    <div className="flex gap-2">
      {vendorData.payment_status === "PAID" ? (
        <>
          <Button onClick={moveVendors} className="w-full rounded-sm" disabled>
            Move Vendor
          </Button>
          {viewMoveVender && (
            <MoveVendor
              vendorData={vendorData}
              eventData={eventData}
              events={events}
              closeDialog={closeDialog}
              closeMoveVendor={() => setViewMoveVender(false)}
            />
          )}
        </>
      ) : (
        <>
          <Button
            onClick={async () => remindVendorToPay()}
            disabled={loading}
            className="w-full text-black rounded-sm"
          >
            Remind to Pay
          </Button>
          <Button
            onClick={async () => markAsPaid()}
            variant={"secondary"}
            disabled={loading}
            className="w-full rounded-sm"
          >
            Mark as Paid
          </Button>
        </>
      )}
    </div>
  );
}
