"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { createEvent } from "@/lib/actions/events";
import { eventFormSchema } from "@/lib/schemas/events";
import { createClient } from "@/utils/supabase/client";

interface Step1Props {
  onNext: () => void;
}

export default function Step1({ onNext }: Step1Props) {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      venueName: "",
      venueAddress: "",
      date: undefined,
      startTime: "",
      endTime: "",
      ticketPrice: "",
      ticketQuantity: "",
      poster: new File([], ""),
    },
  });

  const onSubmit = async () => {
    const payload = form.getValues();
    const poster = form.getValues().poster;

    payload.poster = undefined;

    if (poster) {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("posters")
        .upload(`poster${Date.now()}.png`, poster);
      if (data) {
        payload.poster = data.path;
      } else if (error) {
        throw new Error(error.message);
      }
    }
    await createEvent(payload);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Small Description" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Venue Name" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="venueAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Venue Address" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
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
                        onSelect={field.onChange}
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
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input placeholder="Start Time" type="time" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input placeholder="End Time" type="time" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ticket Price" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Ticket Quantity" {...field} />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="poster">Poster</FormLabel>
                  <FormControl>
                    <Input
                      id="poster"
                      className="pt-2"
                      placeholder="Ticket Quantity"
                      type="file"
                      multiple={false}
                      accept="image/png, image/jpeg"
                      onChange={(e) => {
                        field.onChange(
                          e.target.files ? e.target.files[0] : null
                        );
                      }}
                    />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full py-6 mt-20">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
