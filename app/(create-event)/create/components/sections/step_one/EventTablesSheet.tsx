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

type EventTablesSheetProps = {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  index: number;
};

export default function EventTablesSheet({
  openSheet,
  setOpenSheet,
  index,
}: EventTablesSheetProps) {
  const { control } = useFormContext<CreateEvent>();

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Edit Table</SheetTitle>
        </SheetHeader>
        <div className="space-y-4">
          <FormField
            control={control}
            name={`tables.${index}.name`}
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
            name={`tables.${index}.price`}
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
                      field.onChange(value.toFixed(2));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`tables.${index}.quantity`}
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
            name={`tables.${index}.spaceAllocated`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
                    inputMode="numeric"
                    label="Space Allocated"
                    className="w-full"
                    {...field}
                    value={`${field.value} ft²`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(value);
                    }}
                    onBlur={() => {
                      const value = parseFloat(field.value);
                      field.onChange(Number.isNaN(value) ? "0.00" : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`tables.${index}.numberVendorsAllowed`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
                    inputMode="numeric"
                    label="Number of Vendors Allowed"
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
            name={`tables.${index}.additionalInformation`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TextareaWithLabel
                    label="Additional Information (optional)"
                    placeholder="Enter any additional information for vendors for this table tier"
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
