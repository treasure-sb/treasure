"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function InviteLink() {
  const { toast } = useToast();
  const inviteLink = "http://localhost:3000/events/organizer/invite-vendors/";

  const handleCopy = () => {
    const naviagtorCopy = async () => {
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast({
          title: "Invite Link Copied!",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };
    naviagtorCopy();
  };

  return (
    <Button onClick={handleCopy} className="mt-10" variant={"secondary"}>
      Copy Invite Link
    </Button>
  );
}
