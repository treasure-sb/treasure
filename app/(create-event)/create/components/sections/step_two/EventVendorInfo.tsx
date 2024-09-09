import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CreateEventCard from "../../CreateEventCard";
import { CreateEvent } from "../../../schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { Checkbox } from "@/components/ui/checkbox";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function EventVendorInfo() {
  const { control } = useFormContext<CreateEvent>();
  const { append, remove, fields } = useFieldArray({
    control,
    name: "vendorInfo.terms",
  });

  const handleAppend = () => {
    append({ term: "" });
  };

  const handleRemove = (index: number) => {
    if (fields.length === 1) {
      toast.error("You must have at least one term for vendors");
      return;
    }
    remove(index);
  };

  const EventVendorInfoFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button
        type="button"
        variant={"outline"}
        className="space-x-2 text-xs rounded-full"
        onClick={handleAppend}
      >
        <PlusIcon size={18} />
        <span>Add Another Term</span>
      </Button>
    </div>
  );

  // <Trash2Icon
  //   size={16}
  //   className="text-muted-foreground ml-auto hover:text-destructive transition hover:cursor-pointer"
  //   onClick={() => remove(index)}
  // />;

  return (
    <CreateEventCard title="Vendor Information" footer={EventVendorInfoFooter}>
      <div className="space-y-2">
        <FormField
          control={control}
          name="vendorInfo.checkInTime"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel label="Check-in Time" type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="vendorInfo.checkInLocation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel
                  label="Check-in Location"
                  placeholder="Enter the location for vendor check-in"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="vendorInfo.additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextareaWithLabel
                  label="Additional Information"
                  placeholder="Enter any additional information for vendors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="vendorInfo.wifiAvailability"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md py-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                Will there be free WiFi available for vendors?
              </FormLabel>
            </FormItem>
          )}
        />
        <FormLabel>Terms for Vendors</FormLabel>
        <ul className="list-disc list-outside ml-5 space-y-2">
          {fields.map((field, index) => (
            <li key={field.id} className="flex">
              <FormField
                control={control}
                name={`vendorInfo.terms.${index}.term`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the terms for vendors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </CreateEventCard>
  );
}
