"use client";

import BackButton from "@/components/ui/custom/back-button";
import { useRouter } from "next/navigation";

export default function Back({ cleanedName }: { cleanedName: string }) {
  const { push } = useRouter();

  return (
    <div className="md:max-w-[58rem] mx-auto">
      <BackButton
        label="Back to Tickets"
        onClick={() => {
          push(`/events/${cleanedName}/tickets?embed=true`);
        }}
      />
    </div>
  );
}
