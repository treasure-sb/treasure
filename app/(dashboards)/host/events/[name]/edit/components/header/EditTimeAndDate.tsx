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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { EventDisplayData } from "@/types/event";
import { FormType } from "./EditEventForm";
import { useState } from "react";
import { convertToStandardTime, formatDate } from "@/lib/utils";
import EventCalendar from "@/components/ui/custom/event-calendar";

export default function EditTimeAndDate({
  form,
  event,
}: {
  form: FormType;
  event: EventDisplayData;
}) {
  const [edit, setEdit] = useState(false);
  const [currentDate, setCurrentDate] = useState(event.date);
  const [currentStartTime, setCurrentStartTime] = useState(event.start_time);
  const [currentEndTime, setCurrentEndTime] = useState(event.end_time);

  const eventMonth = parseInt(currentDate.split("-")[1]);
  const eventDay = parseInt(currentDate.split("-")[2]);
  const formattedDate = formatDate(currentDate);
  const formattedStartTime = convertToStandardTime(currentStartTime);
  const formattedEndTime = convertToStandardTime(currentEndTime);

  return (
    <div>
      {edit ? (
        <div className="flex flex-wrap space-x-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="ml-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex justify-between w-60 pl-2 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : format(new Date(event.date), "PPP")}
                        <CalendarDays className="stroke-1" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setCurrentDate(date?.toISOString().split("T")[0] ?? "");
                        setEdit(false);
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
          <FormField
            control={form.control}
            name="startTime"
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
                      setEdit(false);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
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
                    setEdit(false);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div
          className="flex space-x-4 items-center"
          onDoubleClick={() => setEdit(true)}
        >
          <EventCalendar month={eventMonth} day={eventDay} />
          <div>
            <p>{formattedDate}</p>
            <p>
              {formattedStartTime} - {formattedEndTime}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
