"use client";

import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const ticketSchema = z.object({
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
  ticket_name: z.string().min(1, {
    message: "Ticket name is required",
  }),
});

const stepTwoSchema = z.object({
  tickets: z.array(ticketSchema),
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
      tickets: eventForm.tickets,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });
  const [numTickets, setNumTickets] = useState(1);

  const handleNext = () => {
    const newForm = {
      ...eventForm,
      ...form.getValues(),
    };
    setEventForm(newForm);
    onNext();
  };

  const addTicketTier = () => {
    append({ ticket_price: "", ticket_quantity: "", ticket_name: "" });
    setNumTickets(numTickets + 1);
  };

  const removeTicketTier = () => {
    remove(numTickets - 1);
    setNumTickets(numTickets - 1);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6 mb-10">
            <h1 className="text-3xl font-semibold">Create Event</h1>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.ticket_price`}
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
                    name={`tickets.${index}.ticket_quantity`}
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
                    name={`tickets.${index}.ticket_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Ticket Name (eg. GA)"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-1">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
            <div className="flex space-x-4">
              <Button
                onClick={addTicketTier}
                type="button"
                variant={"secondary"}
              >
                Add Ticket Tier
              </Button>{" "}
              {numTickets > 1 && (
                <Button
                  type="button"
                  onClick={removeTicketTier}
                  variant={"secondary"}
                >
                  Remove Ticket Tier
                </Button>
              )}
            </div>
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
