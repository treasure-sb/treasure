"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DateRangeFilter() {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, refresh } = useRouter();

  const handleCalenderDateSelect = (date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (date?.from) {
      const formattedDate = format(date.from, "yyyy-MM-dd");
      params.set("from", formattedDate);
    }
    if (date?.to) {
      const formattedDate = format(date.to, "yyyy-MM-dd");
      params.set("to", formattedDate);
    }
    setDate(date);
    replace(`${pathname}?${params.toString()}`);
    refresh();
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild className="rounded-sm">
          <Button
            id="date"
            variant={"dotted"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" side="top">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(e) => handleCalenderDateSelect(e)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
