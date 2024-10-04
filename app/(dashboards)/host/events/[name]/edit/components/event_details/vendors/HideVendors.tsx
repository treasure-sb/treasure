"use client";

import { EventDisplayData } from "@/types/event";
import { createClient } from "@/utils/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function HideVendors({ event }: { event: EventDisplayData }) {
  const [isChecked, setIsChecked] = useState(event.vendors_hidden);

  const hideVendors = async (checked: boolean) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("events")
        .update({ vendors_hidden: checked })
        .eq("id", event.id);

      if (error) {
        console.error("Error updating event:", error);
      } else {
        console.log("Event updated:", data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleCheckedChange = (checked: boolean) => {
    setIsChecked(checked);
    hideVendors(checked);
  };

  return (
    <div className="flex gap-4 px-6">
      <Checkbox checked={isChecked} onCheckedChange={handleCheckedChange} />
      Hide vendors on the event page
    </div>
  );
}
