import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function Cancel({ handleCancel }: { handleCancel: () => void }) {
  return (
    <Button className="p-2 h-[28px]" variant={"ghost"} onClick={handleCancel}>
      <XIcon className="h-[12px] w-[12px] text-muted-foreground" />
    </Button>
  );
}
