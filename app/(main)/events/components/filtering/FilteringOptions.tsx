"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import Cancel from "@/components/icons/Cancel";
import DateFiltering from "./DateFiltering";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Search from "@/components/icons/Search";

/**
 * FilteringButtons provides filtering options for events. It includes buttons for location filtering,
 * date filtering through a `DateFiltering` component, and a search input for event names.
 */
export default function FilteringOptions() {
  const [clickedSearch, setClickedSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  useEffect(() => {
    if (inputRef.current && clickedSearch) {
      inputRef.current.focus();
    }
  }, [clickedSearch]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCancel = () => {
    setClickedSearch(false);
    handleSearch("");
  };

  return (
    <div
      className={`${
        clickedSearch
          ? "flex-col space-x-0 space-y-2 md:flex-row md:space-x-2 md:space-y-0"
          : "flex-row"
      } flex space-x-2 mb-2`}
    >
      <div className="flex space-x-2">
        <Button>New York, NY</Button>
        <DateFiltering />
      </div>
      <>
        {clickedSearch || searchParams.get("search") ? (
          <div className="w-full flex space-x-1 items-center md:h-8">
            <Input
              defaultValue={searchParams.get("search")?.toString()}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:w-[50%]"
              placeholder="Search for Events"
              ref={inputRef}
            />
            <Cancel handleCancel={handleCancel} />
          </div>
        ) : (
          <Button
            onClick={() => setClickedSearch(true)}
            variant={"ghost"}
            className="rounded-full px-2"
          >
            <Search fill="white" />
          </Button>
        )}
      </>
    </div>
  );
}
