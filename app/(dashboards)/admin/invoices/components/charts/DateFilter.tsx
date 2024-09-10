"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function DateFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "7d") {
      params.delete("period");
    } else {
      params.set("period", value);
    }
    replace(`${pathname}?${params.toString()}`);
    refresh();
  };

  return (
    <Select
      defaultValue={
        searchParams.get("period") === "30d"
          ? "30d"
          : searchParams.get("period") === "24h"
          ? "24h"
          : "7d"
      }
      onValueChange={handleSelect}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Days" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 Days</SelectItem>
        <SelectItem value="30d">Last 30 Days</SelectItem>
      </SelectContent>
    </Select>
  );
}
