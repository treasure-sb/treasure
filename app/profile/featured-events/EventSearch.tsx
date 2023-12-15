"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Search from "@/components/icons/Search";

export default function EventSearch() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mt-4 relative">
      <Input
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 w-full"
        placeholder="Search Events"
      />
      <Search className="absolute top-3" fill="white" />
    </div>
  );
}
