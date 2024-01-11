"use client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export default function InviteLink({
  temporary_profile_id,
}: {
  temporary_profile_id: string;
}) {
  const { toast } = useToast();
  const supabase = createClient();

  const handleCopy = async () => {
    const createInviteToken = async (invite_token: string) => {
      try {
        await supabase.from("signup_invite_tokens").insert([
          {
            token: invite_token,
            temp_profile_id: temporary_profile_id,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    const naviagtorCopy = async () => {
      try {
        const inviteToken = uuidv4();
        await createInviteToken(inviteToken);
        const inviteLink = `${window.location.origin}/signup?signup_invite_token=${inviteToken}`;
        setTimeout(() => {
          navigator.clipboard.writeText(inviteLink);
        }, 0);

        toast({
          title: "Sign up Invite Link Copied!",
        });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    await naviagtorCopy();
  };

  return (
    <Button onClick={handleCopy} variant={"ghost"}>
      Copy Signup Invite Link
    </Button>
  );
}
