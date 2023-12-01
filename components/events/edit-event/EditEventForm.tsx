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
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { EventFormLocation } from "@/types/event";
import Autocomplete from "../../places/Autocomplete";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface EventProps {
  event: any;
  posterUrl: string;
}

function fixDate(time: string) {
  const fixedTime = time
    .slice(time.indexOf("-") + 1)
    .concat("-" + time.slice(0, time.indexOf("-")));
  return new Date(fixedTime);
}

// Function to validate time format (HH:mm)
function isValidTime(value: string) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
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
  date: z.date({
    required_error: "Date is required",
  }),
  start_time: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
  end_time: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
});

export default function EditEventForm({ event, posterUrl }: EventProps) {
  const [tags, setTags] = useState<any[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [event_tags, setEventTags] = useState<any[]>([]);
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
      date: fixDate(event.date),
      start_time: event.start_time,
      end_time: event.end_time,
    },
  });

  console.log(event.date);
  fixDate(event.date);
  // get events tags
  const supabase = createClient();
  useEffect(() => {
    const getTags = async () => {
      const { data: tags, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("name", `%${tagSearch}%`)
        .order("name", { ascending: true });

      if (tags) {
        setTags(tags);
      }
    };
    getTags();
  }, [tagSearch]);

  // method to handle tags
  const handleTagSelect = (tag: any) => {
    console.log(tag);
    if (!event_tags.some((eventTag) => eventTag[0] === tag.name)) {
      setEventTags([...event_tags, [tag.name, tag.id]]);
    } else {
      setEventTags(event_tags.filter((eventTag) => eventTag[0] !== tag.name));
    }
  };

  // handle submit
  const onSubmit = async () => {
    const newForm = {
      ...form.getValues(),
    };
    console.log(event_tags);
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
              <div className="flex overflow-scroll scrollbar-hidden h-12 space-x-2 mt-4">
                {tags?.map((tag) => (
                  <Button
                    onClick={() => handleTagSelect(tag)}
                    variant={
                      event_tags.some((eventTag) => eventTag[0] === tag.name)
                        ? "default"
                        : "secondary"
                    }
                    type="button"
                    className="h-8"
                    key={tag.id}
                  >
                    <h1>{tag.name}</h1>
                  </Button>
                ))}
              </div>
            </div>

            <Autocomplete setVenueLocation={setVenueLocation} />
            <FormField
              control={form.control}
              name="start_time"
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
              name="end_time"
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 py-6 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? (console.log(field.value),
                              format(field.value, "PPP"))
                            : format(event.date, "PPP")}
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
          </div>
          <Button type="submit" className="w-full py-6">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
