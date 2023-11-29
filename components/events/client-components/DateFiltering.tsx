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
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClickToday = () => {
    const todaysDateFormatted = format(new Date(), "yyyy-MM-dd");

    const params = new URLSearchParams(searchParams);
    params.set("from", todaysDateFormatted);
    params.set("until", todaysDateFormatted);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClickTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = format(tomorrow, "yyyy-MM-dd");

    const params = new URLSearchParams(searchParams);
    params.set("from", tomorrowFormatted);
    params.set("until", tomorrowFormatted);
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

  const hanldeClearDate = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("from");
    params.delete("until");
    replace(`${pathname}?${params.toString()}`);
  };

  let from = searchParams.get("from");
  let until = searchParams.get("until");
  let hasDateQuery = from && until;
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
  }

  return (
    <div className="flex space-x-2 items-center">
      <DropdownMenu open={isCalenderOpen} onOpenChange={setIsCalenderOpen}>
        <DropdownMenuTrigger asChild>
          <Button>{hasDateQuery ? <>{dateDisplayed}</> : <>Date</>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex justify-center p-2">
            <DropdownMenuItem onClick={handleClickToday}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClickTomorrow}>
              Tomorrow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClickThisWeek}>
              This Week
            </DropdownMenuItem>
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
      {hasDateQuery && (
        <Button
          className="p-2 h-6 bg-secondary text-red-400 hover:bg-secondary hover:text-red-500 transition duration-300"
          onClick={hanldeClearDate}
        >
          x
        </Button>
      )}
    </div>
  );
}
