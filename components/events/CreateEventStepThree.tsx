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

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const stepTwoSchema = z.object({
  ticket_price: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) > 0;
    },
    {
      message: "Must be a valid ticket price",
    }
  ),
  ticket_quantity: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) > 0;
    },
    {
      message: "Must be a valid ticket price",
    }
  ),
});

export default function Step3({
  onNext,
  onBack,
  eventForm,
  setEventForm,
}: Step3Props) {
  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      ticket_price: eventForm.ticket_price,
      ticket_quantity: eventForm.ticket_quantity,
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
              name="ticket_price"
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
              name="ticket_quantity"
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
          </div>
          <div className="flex space-x-2">
            <Button className="w-full" onClick={() => onBack()}>
              Back
            </Button>
            <Button className="w-full" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
