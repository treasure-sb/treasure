"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export default function InviteLink({ event_url }: { event_url: string }) {
  const { toast } = useToast();
  const supabase = createClient();

  const handleCopy = async () => {
    const createInviteToken = async (invite_token: string) => {
      try {
        const expirationTimestamp = new Date(
          Date.now() + 24 * 60 * 60 * 1000 * 7
        );
        await supabase.from("vendor_invite_tokens").insert([
          {
            token: invite_token,
            expires_at: expirationTimestamp,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    const navigatorCopy = async () => {
      try {
        const inviteToken = uuidv4();
        await createInviteToken(inviteToken);

        const inviteLink = `${window.location.origin}/vendor-invite?invite_token=${inviteToken}&event_name=${event_url}`;
        setTimeout(() => {
          navigator.clipboard.writeText(inviteLink);
        }, 0);

        toast({
          title: "Invite Link Copied!",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    await navigatorCopy();
  };

  return (
    <Button onClick={handleCopy} variant={"secondary"}>
      Copy Invite Link
    </Button>
  );
}
