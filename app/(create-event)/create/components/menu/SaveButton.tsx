import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { CreateEvent } from "../../schema";
import { handleImagesUpload } from "./helper";
import { createClient } from "@/utils/supabase/client";
import { useCreateEvent } from "../../context/CreateEventContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SaveButton({
  isDesktop,
}: {
  isDesktop: boolean | undefined;
}) {
  const { user, eventId, originalDraft, dispatch } = useCreateEvent();
  const { getValues } = useFormContext<CreateEvent>();
  const { refresh } = useRouter();
  const supabase = createClient();
  const isLoggedIn = user !== null;

  const onSave = async () => {
    if (!isLoggedIn) {
      return;
    }

    try {
      toast.loading("Saving event...");
      const values = getValues();

      const updatedValues = await handleImagesUpload(values, originalDraft);

      const { data, error } = await supabase.rpc("save_draft", {
        event_data: updatedValues,
        user_id: user!.id,
        p_event_id: eventId,
      });

      if (error) {
        throw error;
      }

      const draftEventId = data;
      dispatch({ type: "setEventId", payload: draftEventId });
      refresh();
      toast.dismiss();
      toast.success("Event saved successfully");
    } catch (err: any) {
      console.log(err);
      toast.dismiss();
      if ((err.message as string).includes("events_name_check")) {
        toast.error("Please include a name for your event");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Button
      type="button"
      variant={"tertiary"}
      onClick={onSave}
      className={cn(
        "w-full h-full rounded-none relative overflow-hidden",
        isDesktop && "rounded-sm"
      )}
    >
      <span className="relative z-10">Save</span>
    </Button>
  );
}
