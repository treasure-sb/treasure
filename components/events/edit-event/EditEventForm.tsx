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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { EventFormLocation } from "@/types/event";
import Autocomplete from "../../places/Autocomplete";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

interface EventProps {
  event: any;
  posterUrl: string;
}

const eventSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  venue_name: z.string().min(1, {
    message: "Location name is required",
  }),
});

export default function EditEventForm({ event, posterUrl }: EventProps) {
  const [tags, setTags] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [venueLocation, setVenueLocation] = useState<EventFormLocation | null>(
    null
  );

  //create form for event
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      venue_name: event.venue_name,
    },
  });

  const onSubmit = async () => {
    const newForm = {
      ...form.getValues(),
    };
    console.log(newForm);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Create Event</h1>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
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
              name="venue_name"
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
            <div>
              <Input
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search for tags..."
              ></Input>
            </div>
            <Autocomplete setVenueLocation={setVenueLocation} />
          </div>
          <Button type="submit" className="w-full py-6">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
