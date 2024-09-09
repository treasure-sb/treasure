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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";

type EventTicketsSheetProps = {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  index: number;
};

export default function EventTicketsSheet({
  openSheet,
  setOpenSheet,
  index,
}: EventTicketsSheetProps) {
  const { control } = useFormContext<CreateEvent>();

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Edit Ticket</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <FormField
            control={control}
            name={`tickets.${index}.name`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel label="Name" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
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
                  />
                </FormControl>
                <FormMessage />
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
                  />
                </FormControl>
                <FormMessage />
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
                    label="Description"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
