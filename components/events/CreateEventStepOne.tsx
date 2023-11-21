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
import Autocomplete from "../places/Autocomplete";

interface Step1Props {
  onNext: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const stepOneSchema = z.object({
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

export default function Step1({ onNext, eventForm, setEventForm }: Step1Props) {
  const [venueLocation, setVenueLocation] = useState<EventFormLocation | null>(
    null
  );
  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: eventForm.name,
      description: eventForm.description,
      venue_name: eventForm.venue_name,
    },
  });

  const handleNext = () => {
    const newForm = {
      ...eventForm,
      ...venueLocation,
      ...form.getValues(),
    };
    setEventForm(newForm);
    onNext();
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6">
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
            <Autocomplete setVenueLocation={setVenueLocation} />
          </div>
          <Button type="submit" className="w-full py-6 mt-20">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
