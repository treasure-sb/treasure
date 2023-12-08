"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Filters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(
    searchParams.get("filter") || "Attending"
  );
  const { replace } = useRouter();

  const filters: string[] = ["Attending", "Hosting", "Applied"];

  const handleClick = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === "Attending") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    setActive(filter);
    replace(`${pathname}?${params.toString()}`);
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
