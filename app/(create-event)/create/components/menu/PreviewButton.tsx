import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateEvent } from "../../context/CreateEventContext";

export default function PreviewButton({
  isDesktop,
}: {
  isDesktop: boolean | undefined;
}) {
  const { preview, dispatch } = useCreateEvent();

  return (
    <Button
      type="button"
      variant={"ghost"}
      onClick={() => {
        dispatch({
          type: "setPreview",
          payload: preview ? false : true,
        });
      }}
      className={cn(
        "w-fit h-full rounded-none relative overflow-hidden",
        isDesktop && "rounded-sm"
      )}
    >
      {preview ? <EyeOff width={60} /> : <Eye width={60} />}
    </Button>
  );
}
