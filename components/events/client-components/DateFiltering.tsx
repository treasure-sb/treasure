"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";

export default function DateFiltering() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleCalenderDateSelect = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      params.set("from", formattedDate);
      params.set("until", formattedDate);
      setDate(date);
      setIsCalenderOpen(false);
    } else {
      params.delete("from");
      params.delete("until");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu open={isCalenderOpen} onOpenChange={setIsCalenderOpen}>
      <DropdownMenuTrigger asChild>
        <Button>Date</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="flex justify-center p-2">
          <DropdownMenuItem>Today</DropdownMenuItem>
          <DropdownMenuItem>Tomorrow</DropdownMenuItem>
          <DropdownMenuItem>This Week</DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleCalenderDateSelect}
          className="rounded-md"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
