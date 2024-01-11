"use client";
import { Button } from "@/components/ui/button";

export default function AcceptButton({
  handleAccept,
}: {
  handleAccept: () => Promise<void>;
}) {
  return (
    <Button className="w-full" onClick={async () => await handleAccept()}>
      Accept
    </Button>
  );
}
