"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Vendor } from "./VendorDataColumns";
import { useState } from "react";
import { toast } from "sonner";
import { sendVendorNotificationSMS } from "@/lib/sms";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function NotifyVendor({ vendor }: { vendor: Vendor }) {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useRouter();

  const sendMessage = async () => {
    setLoading(true);
    toast.loading("Sending message...");

    if (!vendor.notificationPayload) {
      toast.dismiss();
      toast.error("No phone number found for this vendor.");
      setLoading(false);
      return;
    }

    await sendVendorNotificationSMS(
      vendor.notificationPayload.phone,
      vendor.notificationPayload.eventName,
      message
    );

    await supabase
      .from("event_vendors")
      .update({ notified_of_assignment: true })
      .eq("vendor_id", vendor.vendor_id)
      .eq("event_id", vendor.notificationPayload.eventId);

    toast.dismiss();
    toast.success("Message sent!");
    setLoading(false);
    refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Send Message</Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Message {vendor.name}</DialogTitle>
        </DialogHeader>
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-2 sm:px-4"
          rows={3}
          placeholder={`Notify ${vendor.name} about their assignment...`}
        />
        <Button
          onClick={async () => await sendMessage()}
          disabled={loading}
          className="w-full"
        >
          Send Text
        </Button>
      </DialogContent>
    </Dialog>
  );
}
