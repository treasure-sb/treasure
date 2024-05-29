"use client";

import SelectEdit from "./SelectEdit";
import { useState } from "react";

export default function EditState({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState("Event Details");

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div className="max-w-[1160px] mx-auto">
      <SelectEdit active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Event Details" && children[0]}
        {active === "Vendors" && children[1]}
      </div>
    </div>
  );
}
