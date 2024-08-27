"use client";

import { Tables } from "@/types/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { sendHostMessageEmail } from "@/lib/actions/emails";
import { HostMessageProps } from "@/emails/HostMessage";
import { EventDisplayData } from "@/types/event";
import { sendNotifications, sendSMS } from "@/lib/actions/twilio";

enum Recipients {
  ALL_ATTENDEES = "All Attendees",
  ALL_VENDORS = "All Vendors",
  PAID_VENDORS = "Paid Vendors",
  UNPAID_VENDORS = "Unpaid Vendors",
  PENDING_VENDORS = "Pending Vendors",
}

type RecipientData = {
  phone: string | null;
  email: string | null;
};

type AttendeeData = {
  email: string | null;
  profiles: {
    phone: string | null;
  }[];
};

export default function Message({
  event,
  host,
}: {
  event: EventDisplayData;
  host: Tables<"profiles">;
}) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const recipients = Object.values(Recipients);
  const vendorOptions = recipients.filter(
    (recipient) => recipient !== "All Attendees" && recipient !== "All Vendors"
  );

  const handleClickGroup = (tableName: string) => {
    const isSpecificVendorSelection = vendorOptions.includes(
      tableName as Recipients
    );
    const allVendors = [...vendorOptions, tableName];
    const isSelected = selectedGroups.includes(tableName);

    if (isSelected) {
      if (isSpecificVendorSelection) {
        setSelectedGroups(
          selectedGroups.filter(
            (name) => name !== Recipients.ALL_VENDORS && name != tableName
          )
        );
      } else if (tableName === Recipients.ALL_VENDORS) {
        setSelectedGroups(
          selectedGroups.filter((name) => {
            return !allVendors.includes(name as Recipients);
          })
        );
      } else {
        setSelectedGroups(selectedGroups.filter((name) => name !== tableName));
      }
    } else {
      if (tableName === Recipients.ALL_VENDORS) {
        setSelectedGroups([...selectedGroups, ...allVendors]);
      } else {
        setSelectedGroups((currentSelected) => {
          const updatedSelection = [...currentSelected];
          updatedSelection.push(tableName);

          const allVendorsSelected = vendorOptions.every((vendor) =>
            updatedSelection.includes(vendor)
          );

          if (allVendorsSelected) {
            updatedSelection.push(Recipients.ALL_VENDORS);
          }

          return updatedSelection;
        });
      }
    }
  };

  const handleSendText = async () => {
    if (handleInitialErrors()) return;

    toast.loading("Sending texts...");

    const recipientsToMessage = filterSelectedGroups();
    const phoneNumbers = new Set<string>();

    for (const recipients of recipientsToMessage) {
      const recipientData = await getRecipients(recipients as Recipients);
      recipientData.forEach(({ phone }) => {
        if (phone) {
          phoneNumbers.add(phone);
        }
      });
    }

    if (phoneNumbers.size === 0) {
      toast.dismiss();
      toast.error("No recipients to message");
      return;
    }

    const phoneList = [...phoneNumbers];

    const smsMessage = `📣 The host of ${event.name} sent you a message - \n\n"${message}"\n\nEvent details 👇\n\nwww.ontreasure.xyz/events/${event.cleaned_name}`;

    const response = await sendNotifications(phoneList, smsMessage);
    if (!response.success) {
      toast.dismiss();
      toast.error("Error sending text blast. Please try again.");
      return;
    }
    toast.dismiss();
    toast.success("Texts Sent!");
  };

  const handleSendEmail = async () => {
    if (handleInitialErrors()) return;

    toast.loading("Sending emails...");

    const recipientsToMessage = filterSelectedGroups();
    const emails = new Set<string>();
    for (const recipients of recipientsToMessage) {
      const recipientData = await getRecipients(recipients as Recipients);
      recipientData.forEach(({ email }) => {
        if (email) {
          emails.add(email);
        }
      });
    }

    if (emails.size === 0) {
      toast.dismiss();
      toast.error("No recipients to message");
      return;
    }

    const emailProps: HostMessageProps = {
      eventName: event.name,
      hostName: host.business_name || host.first_name,
      posterUrl: event.publicPosterUrl,
      message,
    };

    const emailList = [...emails];

    const { error: sendingEmailsError } = await sendHostMessageEmail(
      emailList,
      emailProps
    );

    if (sendingEmailsError) {
      toast.error("Error sending emails");
      return;
    }

    toast.dismiss();
    toast.success("Emails sent!");
  };

  const filterSelectedGroups = () => {
    let recipientsToMessage = selectedGroups;
    if (recipientsToMessage.includes(Recipients.ALL_VENDORS)) {
      recipientsToMessage = recipientsToMessage.filter(
        (recipient) => !vendorOptions.includes(recipient as Recipients)
      );
    }
    return recipientsToMessage;
  };

  const handleInitialErrors = () => {
    if (message.length === 0) {
      toast.error("Please enter a message");
      return true;
    }

    if (selectedGroups.length === 0) {
      toast.error("Please select recipients to message");
      return true;
    }

    return false;
  };

  const getRecipients = async (
    recipients: Recipients
  ): Promise<RecipientData[]> => {
    switch (recipients) {
      case Recipients.ALL_ATTENDEES:
        const { data: allAttendeesData } = await supabase
          .from("event_tickets")
          .select("email, profiles(phone)")
          .eq("event_id", event.id);

        const attendeeProfiles: AttendeeData[] = allAttendeesData || [];
        const allAttendees: RecipientData[] = attendeeProfiles.flatMap(
          (item) => {
            return { phone: item.profiles[0]?.phone, email: item.email };
          }
        );

        return allAttendees;

      case Recipients.ALL_VENDORS:
        const { data: allVendorsData } = await supabase
          .from("event_vendors")
          .select("phone:application_phone, email:application_email")
          .eq("event_id", event.id);

        const allVendors: RecipientData[] = allVendorsData || [];
        return allVendors;

      case Recipients.PAID_VENDORS:
        const { data: paidData } = await supabase
          .from("event_vendors")
          .select("phone:application_phone, email:application_email")
          .eq("payment_status", "PAID")
          .eq("event_id", event.id);

        const paidVendors: RecipientData[] = paidData || [];
        return paidVendors;
      case Recipients.PENDING_VENDORS:
        const { data: pendingData } = await supabase
          .from("event_vendors")
          .select("phone:application_phone, email:application_email")
          .eq("application_status", "PENDING")
          .eq("event_id", event.id);

        const pendingVendors: RecipientData[] = pendingData || [];
        return pendingVendors;
      case Recipients.UNPAID_VENDORS:
        const { data: unpaidData } = await supabase
          .from("event_vendors")
          .select("phone:application_phone, email:application_email")
          .eq("payment_status", "UNPAID")
          .eq("application_status", "ACCEPTED")
          .eq("event_id", event.id);

        const unpaidVendors: RecipientData[] = unpaidData || [];
        return unpaidVendors;
      default:
        return [];
    }
  };

  const recipientButtons = recipients.map((recipient, i) => (
    <Button
      type="button"
      variant={selectedGroups.includes(recipient) ? "default" : "secondary"}
      key={i}
      onClick={() => handleClickGroup(recipient)}
    >
      <p>{recipient}</p>
    </Button>
  ));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Select Recipients</h1>
      <div className="flex flex-wrap gap-2">{recipientButtons}</div>
      <Textarea
        rows={15}
        className="my-10"
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message..."
      />
      <div className="flex gap-4">
        <Button className="w-40" onClick={handleSendEmail} type="button">
          Send Email
        </Button>
      </div>
    </div>
  );
}
