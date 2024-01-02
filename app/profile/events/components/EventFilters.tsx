"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

/**
 * EventFilters provides a set of buttons to filter events based on specific criteria such as 'Attending', 'Hosting', and 'Applied'.
 * It allows users to select a filter to view different categories of events. The filter state is managed using URL search parameters.
 *
 * The component maintains an active state to highlight the currently selected filter and updates the URL parameters accordingly
 * when a new filter is selected.
 *
 * @returns {JSX.Element} - A React component that renders a set of buttons for event filtering.
 */
export default function EventFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(
    searchParams.get("filter") || "Attending"
  );
  const { replace } = useRouter();

  const filters: string[] = ["Attending", "Hosting", "Applied", "Liked"];

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
