"use client";

import { EventVendorData } from "../../../types";
import { EventDisplayData } from "@/types/event";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { moveVendors } from "@/lib/actions/vendors/applications";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  event: z.string({
    required_error: "Please select an event.",
  }),
});

export type EventsInfo = {
  name: string;
  id: string;
  date: string;
  tables: { id: string; section_name: string }[];
};

export default function MoveVendor({
  vendorData,
  eventData,
  events,
  closeDialog,
  closeMoveVendor,
}: {
  vendorData: EventVendorData;
  eventData: EventDisplayData;
  events: EventsInfo[];
  closeDialog: () => void;
  closeMoveVendor: () => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { refresh } = useRouter();

  async function onSubmit() {
    moveVendors(
      vendorData.vendor_id,
      eventData.id,
      vendorData.table_id,
      form.getValues().event
    );
    toast.success("Vendor Moved!");
    closeMoveVendor();
    closeDialog();
    refresh();
  }

  return (
    <div className="absolute top-0 left-0 bg-background w-full flex flex-col justify-between h-full text-sm md:text-base p-6">
      <ArrowLeft
        size={22}
        className="absolute top-6 left-6 text-gray-50 cursor-pointer hover:text-primary"
        onClick={() => closeMoveVendor()}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center w-full h-full justify-between align-middle text-center"
        >
          <div>
            <h4 className="text-2xl font-semiboldm mt-10">Move Vendor</h4>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Vendor will be moved to the new event and still be marked as paid.
            </p>
          </div>

          <div className="flex flex-col justify-between items-center ">
            <p className="text-xs text-center text-muted-foreground">Vendor</p>
            <p>
              {vendorData.vendor.business_name === null
                ? vendorData.vendor.first_name +
                  " " +
                  vendorData.vendor.last_name
                : vendorData.vendor.business_name}
            </p>
          </div>
          <div className="flex flex-col justify-between items-center">
            <p className="text-xs text-center text-muted-foreground">
              Current Event
            </p>
            <p>{eventData.name}</p>
          </div>
          <div className="flex flex-col justify-between items-center w-full gap-2">
            <p className="text-xs text-center text-muted-foreground">
              New Event
            </p>
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem className="w-full px-4">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="space-x-2">
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-left ">
                      {events.map((event: any) => (
                        <SelectItem className="text-left" value={event.id}>
                          <p>{event.name}</p>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="rounded-sm" type="submit">
            Move
          </Button>
        </form>
      </Form>
    </div>
  );
}
