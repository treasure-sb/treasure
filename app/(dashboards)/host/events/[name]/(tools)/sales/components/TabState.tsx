"use client";

import LineTabs from "@/components/ui/custom/line-tabs";
import { useState } from "react";

export default function TabState({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState("Orders");

  const tabs = ["Orders", "Promo Codes"];

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div>
      <LineTabs tabs={tabs} active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Orders" && children[0]}
        {active === "Promo Codes" && children[1]}
      </div>
    </div>
  );
}
