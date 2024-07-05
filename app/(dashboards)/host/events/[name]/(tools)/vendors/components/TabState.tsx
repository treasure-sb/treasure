"use client";

import LineTabs from "@/components/ui/custom/line-tabs";
import { useState } from "react";

export default function TabState({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState("Applications");

  const tabs = ["Applications", "Temporary Vendors", "Assignments"];

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div>
      <LineTabs tabs={tabs} active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Applications" && children[0]}
        {active === "Temporary Vendors" && children[1]}
        {active === "Assignments" && children[2]}
      </div>
    </div>
  );
}
