"use client";
import { toast } from "sonner";
import { Link as Chain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CopyEventLink({
  cleaned_event_name,
}: {
  cleaned_event_name: string;
}) {
  const handleCopy = async () => {
    const navigatorCopy = async () => {
      try {
        const inviteLink = `${window.location.origin}/events/${cleaned_event_name}`;
        setTimeout(() => {
          navigator.clipboard.writeText(inviteLink);
        }, 0);
        toast("Event Link Copied!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    await navigatorCopy();
  };

  return (
    <Button onClick={handleCopy} variant={"ghost"} className="flex space-x-1">
      <Chain className="w-5 h-5 text-primary" />
      <p> Copy Link</p>
    </Button>
  );
}
