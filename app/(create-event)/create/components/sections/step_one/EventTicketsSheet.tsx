import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFormContext } from "react-hook-form";
import { CreateEvent } from "../../../schema";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type EventTicketsSheetProps = {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  index: number;
};

function formatDate(date: Date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

export default function EventTicketsSheet({
  openSheet,
  setOpenSheet,
  index,
}: EventTicketsSheetProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEvent>();
  const dates = watch("dates");
  const tickets = watch("tickets");

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    if (tickets[index]) {
      setSelectedDates(tickets[index].dates);
    }
  }, [index, tickets, dates]);

  const datesSelect = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {dates.map((date, i) => {
          if (!date.date) return null;
          const isActive = selectedDates.some(
            (d) => d.getTime() === date.date!.getTime()
          );
          return (
            <Button
              key={i}
              type="button"
              variant={isActive ? "default" : "outline"}
              className="border"
              onClick={() => {
                const newDates = isActive
                  ? selectedDates.filter(
                      (d) => d.getTime() !== date.date!.getTime()
                    )
                  : [...selectedDates, date.date!];
                setSelectedDates(newDates);
                setValue(`tickets.${index}.dates`, newDates);
              }}
            >
              <span>{formatDate(date.date)}</span>
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Edit Ticket</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mb-4">
          <FormField
            control={control}
            name={`tickets.${index}.name`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
                    label="Name"
                    className="w-full"
                    {...field}
                    error={errors.tickets?.[index]?.name}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`tickets.${index}.price`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
                    label="Price"
                    className="w-full"
                    {...field}
                    value={`$${field.value}`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      const value = parseFloat(field.value);
                      field.onChange(
                        Number.isNaN(value) ? "0.00" : value.toFixed(2)
                      );
                    }}
                    error={errors.tickets?.[index]?.price}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`tickets.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
                    inputMode="numeric"
                    label="Quantity"
                    className="w-full"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                    }}
                    error={errors.tickets?.[index]?.quantity}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`tickets.${index}.description`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TextareaWithLabel
                    label="Description (optional)"
                    className="w-full"
                    placeholder="Add a description for this ticket tier"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Valid For</FormLabel>
            {dates[0] && dates[0].date === undefined ? (
              <FormDescription>No dates available</FormDescription>
            ) : (
              <>
                <FormDescription
                  className={cn(
                    "",
                    errors.tickets?.[index]?.dates && "text-destructive"
                  )}
                >
                  Please select dates for your ticket
                </FormDescription>
                {datesSelect()}
              </>
            )}
          </FormItem>
        </div>
        <Button
          type="button"
          onClick={() => setOpenSheet(false)}
          className="w-full"
        >
          Save
        </Button>
      </SheetContent>
    </Sheet>
  );
}
