import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPinIcon } from "lucide-react";
import { FormType } from "./EditEventForm";

export default function EditLocation({ form }: { form: FormType }) {
  return (
    <div className="flex items-center">
      <div className="w-10">
        <MapPinIcon className="stroke-1 text-foreground/60 mx-auto" />
      </div>
      <FormField
        control={form.control}
        name="venueName"
        render={({ field }) => (
          <FormItem className="relative">
            <FormControl>
              <Input
                className="border-none"
                {...field}
                placeholder="Venue Name"
              />
            </FormControl>
            <FormMessage className="absolute left-28 top-1" />
          </FormItem>
        )}
      />
    </div>
  );
}
