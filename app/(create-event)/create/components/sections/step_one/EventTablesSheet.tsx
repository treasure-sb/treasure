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
                    inputMode="numeric"
                    label="Price"
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
                    label="Space Allocated"
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
            name={`tables.${index}.numberVendorsAllowed`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <InputWithLabel
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
                    label="Additional Information"
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
