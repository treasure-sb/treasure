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
import { CalendarIcon } from "lucide-react";
import Cancel from "@/components/icons/Cancel";
import { DateRange } from "react-day-picker";

export default function DateFiltering() {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isCalenderOpen, setIsCalenderOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleCalenderDateSelect = (date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (date?.from) {
      const formattedDate = format(date.from, "yyyy-MM-dd");
      params.set("from", formattedDate);
    }
    if (date?.to) {
      const formattedDate = format(date.to, "yyyy-MM-dd");
      params.set("until", formattedDate);
    }
    setDate(date);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClickThisWeek = () => {
    const today = new Date();
    const endOfWeek = new Date(today);
    const daysUntilSunday = 6 - today.getDay();
    endOfWeek.setDate(today.getDate() + daysUntilSunday);

    const todaysDateFormatted = format(today, "yyyy-MM-dd");
    const endOfWeekDateFormatted = format(endOfWeek, "yyyy-MM-dd");

    const params = new URLSearchParams(searchParams);
    params.set("from", todaysDateFormatted);
    params.set("until", endOfWeekDateFormatted);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClickThisMonth = () => {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const todaysDateFormatted = format(today, "yyyy-MM-dd");
    const endOfMonthDateFormatted = format(endOfMonth, "yyyy-MM-dd");

    const params = new URLSearchParams(searchParams);
    params.set("from", todaysDateFormatted);
    params.set("until", endOfMonthDateFormatted);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClickNextMonth = () => {
    const today = new Date();
    const startOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const endOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );

    const startOfNextMonthDateFormatted = format(
      startOfNextMonth,
      "yyyy-MM-dd"
    );
    const endOfNextMonthDateFormatted = format(endOfNextMonth, "yyyy-MM-dd");

    const params = new URLSearchParams(searchParams);
    params.set("from", startOfNextMonthDateFormatted);
    params.set("until", endOfNextMonthDateFormatted);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearDate = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("until");
    setDate(undefined);
    replace(`${pathname}?${params.toString()}`);
  };

  // For displaying the date in the button
  let from = searchParams.get("from");
  let until = searchParams.get("until");
  let dateDisplayed = "";
  if (from && until) {
    from = new Date(from).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    until = new Date(until).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    if (from === until) {
      dateDisplayed = from;
    } else {
      dateDisplayed = `${from} - ${until}`;
    }
  } else if (from) {
    from = new Date(from).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
    dateDisplayed = `${from}`;
  }

  return (
    <div className="flex space-x-1 items-center">
      <DropdownMenu open={isCalenderOpen} onOpenChange={setIsCalenderOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="space-x-1 rounded-full">
            <CalendarIcon className="h-4 w-4" />
            <p>{from ? <>{dateDisplayed}</> : "Date"}</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="mt-1 h-[32rem] sm:h-auto overflow-auto"
        >
          <div className="flex justify-center p-2">
            <DropdownMenuItem onClick={handleClickThisWeek}>
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClickThisMonth}>
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClickNextMonth}>
              Next Month
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <Calendar
            mode="range"
            selected={date}
            defaultMonth={date?.from}
            numberOfMonths={2}
            onSelect={(e) => handleCalenderDateSelect(e)}
            className="rounded-md"
          />
        </DropdownMenuContent>
      </DropdownMenu>
      {from && <Cancel handleCancel={handleClearDate} />}
    </div>
  );
}
