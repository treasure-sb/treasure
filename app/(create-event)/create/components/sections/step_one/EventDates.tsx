import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { CalendarIcon, PlusIcon, Trash2Icon } from "lucide-react";
import CreateEventCard from "../../CreateEventCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import format from "date-fns/format";

export default function EventDates() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEvent>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "dates",
  });

  const dates = watch("dates");
  const tickets = watch("tickets");

  const handleAppend = () => {
    if (fields.length >= 5) {
      toast.error("You can only have up to 5 event dates");
      return;
    }

    if (!dates[0].date) {
      append({ date: undefined, startTime: "09:30", endTime: "16:30" });
    } else {
      const newDate = new Date(dates[dates.length - 1].date!);
      newDate.setDate(newDate.getDate() + 1);
      append({ date: newDate, startTime: "09:30", endTime: "16:30" });
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length == 1) {
      toast.error("You must have at least one event date");
      return;
    }

    const startIndex = index === 0 ? 0 : fields.length - 1;

    for (let i = startIndex; i >= index; i--) {
      const dateToRemove = dates[i].date;
      tickets.forEach((ticket, ticketIndex) => {
        const updatedDates = ticket.dates.filter(
          (d) => d.getTime() !== dateToRemove?.getTime()
        );
        setValue(`tickets.${ticketIndex}.dates`, updatedDates);
      });
      remove(i);
    }
  };

  const handleUpdateDates = (date: Date | undefined) => {
    fields.forEach((field, index) => {
      if (index != 0) {
        if (!date) {
          update(index, { ...field, date: undefined });
          return;
        }
        const newDate = new Date(date!);
        newDate.setDate(newDate.getDate() + index);
        update(index, { ...field, date: newDate });
      }
    });
  };

  const EventDatesFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button
        type="button"
        variant={"outline"}
        className="space-x-2 text-xs rounded-full"
        onClick={handleAppend}
      >
        <PlusIcon size={18} />
        <span>Add Another Day</span>
      </Button>
    </div>
  );

  return (
    <CreateEventCard title="Event Dates" footer={EventDatesFooter}>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <>
            <div
              key={field.id}
              className="flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:items-end"
            >
              <FormField
                control={control}
                name={`dates.${index}.date`}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="text-foreground">
                      Event Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"field"}
                            disabled={index > 0}
                            className={cn(
                              "w-full pl-3 text-left font-normal disabled:cursor-not-allowed",
                              !field.value && "text-muted-foreground",
                              errors.dates?.[index]?.date &&
                                "border-destructive bg-red-100 hover:border-destructive"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "MMMM d, yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            handleUpdateDates(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <div className="flex flex-row space-x-2 w-full">
                <FormField
                  control={control}
                  name={`dates.${index}.startTime`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <InputWithLabel
                          type="time"
                          label="Start Time"
                          className="min-w-[90%]"
                          {...field}
                          error={errors.dates?.[index]?.startTime}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`dates.${index}.endTime`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <InputWithLabel
                          type="time"
                          label="End Time"
                          className="min-w-[90%]"
                          {...field}
                          error={errors.dates?.[index]?.endTime}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Trash2Icon
              size={16}
              className="text-muted-foreground ml-auto hover:text-destructive transition hover:cursor-pointer"
              onClick={() => handleRemove(index)}
            />
            {index != fields.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </CreateEventCard>
  );
}
