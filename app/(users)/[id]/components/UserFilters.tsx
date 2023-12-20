"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function UserFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState(
    searchParams.get("filter") || "Portfolio"
  );
  const { replace } = useRouter();

  const handleClick = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === searchParams.get("filter")) {
      params.delete("filter");
      setActive("Portfolio");
    } else {
      params.set("filter", filter);
      setActive(filter);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const filters = ["Portfolio", "Events"];

  return (
    <div className="flex space-x-2 md:justify-end pb-6">
      {filters.map((filter) => (
        <Button
          key={filter}
          onClick={() => handleClick(filter)}
          variant={active === filter ? "default" : "secondary"}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
}
