"use client";

import { Heart } from "lucide-react";
import { CalendarCheck2Icon } from "lucide-react";
import { CrownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * EventFilters is a React component for rendering a filter bar with different event-related options.
 *
 * It displays filter options such as 'Hosting', 'Attending', and 'Liked' as interactive icons.
 * Clicking on these icons allows users to filter events based on their participation or interest.
 * The active filter is highlighted, and clicking on a filter updates the URL's search parameters accordingly.
 *
 * It takes in an optional boolean prop 'isHosting' to determine whether to display the 'Hosting' filter option.
 *
 */
export default function EventFilters({ isHosting }: { isHosting?: boolean }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState(
    searchParams.get("events") || "Attending"
  );
  const { replace } = useRouter();

  const handleClick = (filter: string) => {
    if (filter === active) return;
    const params = new URLSearchParams(searchParams);

    if (filter === "Attending") {
      setActive("Attending");
      params.delete("events");
    } else {
      setActive(filter);
      params.set("events", filter);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const filterOptions = [
    { name: "Attending", Icon: CalendarCheck2Icon },
    { name: "Hosting", Icon: CrownIcon },
    { name: "Liked", Icon: Heart },
  ];

  const renderFilters = () => {
    let filtersToDisplay = filterOptions;
    if (!isHosting) {
      filtersToDisplay = filterOptions.filter(({ name }) => name !== "Hosting");
    }

    return filtersToDisplay.map(({ name, Icon }) => (
      <div
        onClick={() => handleClick(name)}
        key={name}
        className="relative w-full hover:cursor-pointer"
      >
        <Icon
          className={`w-8 h-8 stroke-1 m-auto ${
            active === name ? "text-white" : ""
          }`}
        />
        {active === name && (
          <div className="absolute h-[1px] w-full bg-primary bottom-[-9px]" />
        )}
      </div>
    ));
  };

  return (
    <div className="w-full flex justify-between mt-4 text-secondary">
      {renderFilters()}
    </div>
  );
}
