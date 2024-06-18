"use client";

import LineTabs from "@/components/ui/custom/line-tabs";
import { useState } from "react";

export default function EditState({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("Event Details");

  const tabs = ["Event Details"];

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div className="max-w-[1160px] mx-auto">
      <LineTabs tabs={tabs} active={active} onSelect={handleSelect} />
      <div className="mt-8">{active === "Event Details" && children}</div>
    </div>
  );
}
