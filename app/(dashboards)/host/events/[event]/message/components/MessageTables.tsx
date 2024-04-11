"use client";

import { Tables } from "@/types/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

enum Recipients {
  ALL_ATTENDEES = "All Attendees",
  ALL_VENDORS = "All Vendors",
  PAID_VENDORS = "Paid Vendors",
  PENDING_VENDORS = "Pending Vendors",
  WAITLISTED_VENDORS = "Waitlisted Vendors",
}

type RecipientData = {
  phone: string;
  email: string;
};

export default function MessageTables({
  tables,
  event,
}: {
  tables: Tables<"tables">[];
  event: Tables<"events">;
}) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const supabase = createClient();

  const specificVendorSelections = [
    Recipients.PAID_VENDORS,
    Recipients.PENDING_VENDORS,
    Recipients.WAITLISTED_VENDORS,
  ];

  const handleClickGroup = (tableName: string) => {
    const isSpecificVendorSelection = specificVendorSelections.includes(
      tableName as Recipients
    );
    const allVendors = [...specificVendorSelections, tableName];
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
        setSelectedGroups([...selectedGroups, tableName]);
      }
    }
  };

  const handleSendText = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select recipients to message");
      return;
    }

    const recipientsToMessage = filterSelectedGroups();
    const phoneNumbers: string[] = [];

    for (const recipients of recipientsToMessage) {
      const recipientData = await getRecipients(recipients as Recipients);
      recipientData.forEach((data) => {
        phoneNumbers.push(data.phone);
      });
    }

    if (phoneNumbers.length === 0) {
      toast.error("No recipients to message");
      return;
    }
  };

  const handleSendEmail = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select recipients to message");
      return;
    }

    const recipientsToMessage = filterSelectedGroups();
    const emails: string[] = [];
    for (const recipients of recipientsToMessage) {
      const recipientData = await getRecipients(recipients as Recipients);
      recipientData.forEach((data) => {
        emails.push(data.phone);
      });
    }

    if (emails.length === 0) {
      toast.error("No recipients to message");
      return;
    }
  };

  const handleSendBoth = async () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select recipients to message");
      return;
    }
  };

  const filterSelectedGroups = () => {
    let recipientsToMessage = selectedGroups;
    if (recipientsToMessage.includes(Recipients.ALL_VENDORS)) {
      recipientsToMessage = recipientsToMessage.filter(
        (recipient) =>
          !specificVendorSelections.includes(recipient as Recipients)
      );
    }
    return recipientsToMessage;
  };

  const getRecipients = async (
    recipients: Recipients
  ): Promise<RecipientData[]> => {
    switch (recipients) {
      case Recipients.ALL_VENDORS:
        const { data: allData } = await supabase
          .from("event_vendors")
          .select("phone:application_phone, email:application_email")
          .eq("event_id", event.id);

        const allVendors: RecipientData[] = allData || [];
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
      default:
        return [];
    }
  };

  const recipients = Object.values(Recipients);

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
      <Textarea rows={15} className="my-10" placeholder="Your message..." />
      <div className="flex gap-4">
        <Button className="w-40" onClick={handleSendText} type="button">
          Send Text
        </Button>
        <Button className="w-40" onClick={handleSendEmail} type="button">
          Send Email
        </Button>
        <Button
          variant={"tertiary"}
          onClick={handleSendBoth}
          className="w-40"
          type="button"
        >
          Send Text & Email
        </Button>
      </div>
    </div>
  );
}
