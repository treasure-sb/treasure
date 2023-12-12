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
  table_price: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Must be a valid table price",
    }
  ),
  table_quantity: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) > 0;
    },
    {
      message: "Must be a valid number of tables",
    }
  ),
});

const tablesSchema = z.object({
  tables: z.array(ticketSchema),
});

export default function Step3({
  onNext,
  onBack,
  eventForm,
  setEventForm,
}: Step3Props) {
  const form = useForm<z.infer<typeof tablesSchema>>({
    resolver: zodResolver(tablesSchema),
    defaultValues: {
      tables: eventForm.tables,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tables",
  });
  const [numTables, setNumTables] = useState(1);

  const handleNext = () => {
    const newForm = {
      ...eventForm,
      ...form.getValues(),
    };
    setEventForm(newForm);
    onNext();
    console.log(newForm);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full"
        >
          <div className="space-y-6 mb-10">
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <FormField
                    control={form.control}
                    name={`tables.${index}.table_price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            pattern="\d+(\.\d{2})?"
                            placeholder="Table Price"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-1">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tables.${index}.table_quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Table Quantity" {...field} />
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
          </div>
          <div className="flex space-x-2">
            <Button className="w-full py-6" onClick={() => onBack()}>
              Back
            </Button>
            <Button className="w-full py-6" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
