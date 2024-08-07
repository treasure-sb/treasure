"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmButton({
  tokenID,
  eventID,
  memberID,
}: {
  tokenID: string;
  eventID: string;
  memberID: string;
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const handleConfirm = async () => {
    setIsLoading(true);
    toast.loading("Confirming role...");

    try {
      const { error } = await supabase
        .from("event_roles")
        .update({ status: "ACTIVE" })
        .eq("event_id", eventID)
        .eq("user_id", memberID);

      if (error) {
        throw error;
      }

      const { error: deleteError } = await supabase
        .from("event_roles_invite_tokens")
        .delete()
        .eq("id", tokenID);

      if (deleteError) {
        throw deleteError;
      }

      toast.dismiss();
      toast.success("Role confirmed");
      push(`/host/events/`);
    } catch (error) {
      toast.dismiss();
      toast.error(`Error confirming role`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleConfirm}
      className="rounded-sm w-full"
    >
      Confirm Role
    </Button>
  );
}
