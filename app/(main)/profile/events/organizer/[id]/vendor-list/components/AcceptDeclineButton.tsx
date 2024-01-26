"use client";
import { Button } from "@/components/ui/button";

export default function AcceptDeclineButton({
  handleClick,
  vendor_id,
  event_id,
  type,
}: {
  handleClick: (vendor_id: string, event_id: string) => Promise<void>;
  vendor_id: string;
  event_id: string;
  type: string;
}) {
  let clicked = false;

  return (
    <div>
      <div>
        {clicked ? (
          <Button className="w-full" disabled>
            {type === "0" ? "Accepted" : "Declined"}
          </Button>
        ) : (
          <Button
            className="w-10 h-10 overflow-hidden rounded-full"
            variant={"outline"}
            onClick={async () => {
              await handleClick(vendor_id, event_id);
            }}
          >
            {type === "0" ? "✓" : "x"}
          </Button>
        )}
      </div>
    </div>
  );
}
