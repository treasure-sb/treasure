"use client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function CopyEventLink({ eventName }: { eventName: string }) {
  const { toast } = useToast();

  const handleCopy = async () => {
    const naviagtorCopy = async () => {
      try {
        const inviteLink = `${window.location.origin}/events/${eventName}`;
        setTimeout(() => {
          navigator.clipboard.writeText(inviteLink);
        }, 0);

        toast({
          title: "Event Link Copied!",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    await naviagtorCopy();
  };

  return (
    <Button onClick={handleCopy} variant={"secondary"}>
      Copy Event Link
    </Button>
  );
}
