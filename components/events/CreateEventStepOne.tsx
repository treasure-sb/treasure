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
  venueName: z.string().min(1, {
    message: "Location name is required",
  }),
  venueAddress: z.string().min(1, {
    message: "Location address is required",
  }),
});

export default function Step1({ onNext, eventForm, setEventForm }: Step1Props) {
  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: eventForm.name,
      description: eventForm.description,
      venueName: eventForm.venueName,
      venueAddress: eventForm.venueAddress,
    },
  });

  const handleNext = () => {
    const newForm = {
      ...eventForm,
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
          </div>
          <Button type="submit" className="w-full py-6 mt-20">
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
