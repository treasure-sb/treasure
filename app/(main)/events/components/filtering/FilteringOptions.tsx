"use client";

import DateFiltering from "./DateFiltering";
import Location from "./LocationFiltering";
import SearchFiltering from "./SearchFiltering";

export default function FilteringOptions() {
  return (
    <div className="flex flex-wrap gap-2 w-full mb-2">
      <DateFiltering />
      <Location />
      <SearchFiltering />
    </div>
  );
}
