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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const tableSchema = z.object({
  section_name: z.string().min(1, { message: "Section name is required" }),
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
      message: "Must be a number",
    }
  ),
  table_provided: z.boolean().default(false),
  space_allocated: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Must be a number",
    }
  ),
  number_vendors_allowed: z.string().refine(
    (num) => {
      return !isNaN(Number(num)) && Number(num) >= 0;
    },
    {
      message: "Must be a number",
    }
  ),
  additional_information: z.string().optional(),
});

const tablesSchema = z.object({
  tables: z.array(tableSchema),
});

export default function EventTables({
  onNext,
  onBack,
  eventForm,
  setEventForm,
}: Step3Props) {
  const form = useForm<z.infer<typeof tablesSchema>>({
    resolver: zodResolver(tablesSchema),
    mode: "onBlur",
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
  };

  const addTable = () => {
    append({
      section_name: "",
      table_price: "",
      table_quantity: "",
      table_provided: false,
      space_allocated: "",
      number_vendors_allowed: "",
    });
    setNumTables(numTables + 1);
  };

  const removeTable = () => {
    remove(numTables - 1);
    setNumTables(numTables - 1);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full gap-6"
        >
          <div className="flex flex-col gap-6">
            <div className="text-lg font-semibold text-primary">Tables</div>

            {fields.map((field, index) => {
              return (
                <div className="flex flex-col gap-4" key={field.id}>
                  <div className="text-base font-semibold text-primary">
                    {"Table " + (index + 1)}
                  </div>
                  <FormField
                    control={form.control}
                    name={`tables.${index}.section_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Section / Table Name"
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
                  <div className="flex space-x-3">
                    <FormField
                      control={form.control}
                      name={`tables.${index}.table_provided`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div>Tables will be provided</div>
                  </div>
                  <FormField
                    control={form.control}
                    name={`tables.${index}.space_allocated`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Space allocated for each table (in ft)"
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
                    name={`tables.${index}.number_vendors_allowed`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Number of vendors allowed per table"
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
                    name={`tables.${index}.additional_information`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Additional information (Optional)"
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
            <div className="flex gap-4">
              <Button onClick={addTable} type="button" variant={"secondary"}>
                Add Table
              </Button>{" "}
              {numTables > 1 && (
                <Button
                  type="button"
                  onClick={removeTable}
                  variant={"secondary"}
                >
                  Remove Table
                </Button>
              )}
            </div>
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
