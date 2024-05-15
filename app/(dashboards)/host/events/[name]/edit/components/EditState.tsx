"use client";

import SelectEdit from "./SelectEdit";
import { useState } from "react";

export default function EditState({
  children,
}: {
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState("Event");

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div>
      <SelectEdit active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Event" && children[0]}
        {active === "Tickets" && children[1]}
        {active === "Vendors" && children[2]}
      </div>
    </div>
  );
}
