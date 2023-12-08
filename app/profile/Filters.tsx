"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Filters() {
  const [active, setActive] = useState("Attending");
  const filters: string[] = ["Attending", "Hosting", "Applied"];

  const handleClick = (filter: string) => {
    setActive(filter);
  };

  return (
    <div className="flex space-x-2 overflow-scroll scrollbar-hidden mb-6 mt-2">
      {filters.map((option: string) => (
        <Button
          onClick={() => handleClick(option)}
          variant={option === active ? "default" : "secondary"}
          key={option}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
