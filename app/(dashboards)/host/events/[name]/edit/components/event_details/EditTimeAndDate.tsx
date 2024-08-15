import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { EditEventDisplayData } from "@/types/event";
import { FormType } from "./EditEventForm";
import { useState } from "react";
import { convertToStandardTime, formatDate } from "@/lib/utils";
import { PencilIcon, EyeIcon } from "lucide-react";
import { format } from "date-fns";
import EventCalendar from "@/components/ui/custom/event-calendar";

export default function EditTimeAndDate({
  form,
  event,
}: {
  form: FormType;
  event: EditEventDisplayData;
}) {
  const [edit, setEdit] = useState(false);
  const { date, start_time, end_time } = event.dates[0];
  const [currentDate, setCurrentDate] = useState(date);
  const [currentStartTime, setCurrentStartTime] = useState(start_time);
  const [currentEndTime, setCurrentEndTime] = useState(end_time);

  const eventMonth = parseInt(currentDate.split("-")[1]);
  const eventDays = event.dates.map((date) =>
    parseInt(date.date.split("-")[2])
  );

  const formattedDate = formatDate(currentDate);
  const formattedStartTime = convertToStandardTime(currentStartTime);
  const formattedEndTime = convertToStandardTime(currentEndTime);

  return edit ? (
    <div>
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0 md:items-center">
        <FormField
          control={form.control}
          name={`dates.${0}.date`}
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex justify-between w-60 pl-4 bg-transparent text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : format(new Date(date), "PPP")}
                      <CalendarDays className="stroke-1" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    defaultMonth={field.value}
                    onSelect={(date) => {
                      field.onChange(date || field.value);
                      setCurrentDate(
                        date?.toISOString().split("T")[0] ?? currentDate
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="h-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name={`dates.${0}.startTime`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    className="border-none"
                    label="Start Time"
                    type="time"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setCurrentStartTime(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`dates.${0}.endTime`}
            render={({ field }) => (
              <FormItem>
                <FloatingLabelInput
                  className="border-none"
                  type="time"
                  label="End Time"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setCurrentEndTime(e.target.value);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <EyeIcon
          size={22}
          onClick={() => {
            setEdit(false);
          }}
          className="text-foreground/30 hover:text-foreground duration-500 transition hover:cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div
      className="flex space-x-4 items-center relative w-fit group hover:cursor-pointer"
      onClick={() => setEdit(true)}
    >
      <EventCalendar month={eventMonth} days={eventDays} />
      <div>
        <p>{formattedDate}</p>
        <p>
          {formattedStartTime} - {formattedEndTime}
        </p>
      </div>
      <PencilIcon
        size={20}
        className="absolute -top-1 -right-5 text-foreground/30 group-hover:text-foreground transition duration-500"
      />
    </div>
  );
}
