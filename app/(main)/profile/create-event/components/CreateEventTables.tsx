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

const vendorAppSchema = z.object({
  TaC: z.string().min(1, {
    message: "Terms is required",
  }),
  comment: z.string(),
});

const tablesSchema = z.object({
  tables: z.array(ticketSchema),
  table_public: z.number().default(0).optional(),
  vendor_app: z.array(vendorAppSchema),
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
      table_public: eventForm.table_public,
      vendor_app: eventForm.vendor_app,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tables",
  });
  const [numTables, setNumTables] = useState(1);

  const {
    fields: fieldVendorApp,
    append: appendVendorApp,
    remove: removeVendorApp,
  } = useFieldArray({
    control: form.control,
    name: "vendor_app",
  });

  const checkClicked = () => {
    form.getValues().table_public === 0
      ? form.setValue("table_public", 1)
      : form.setValue("table_public", 0);

    form.getValues().vendor_app?.length === 1
      ? removeVendorApp(0)
      : appendVendorApp({ TaC: "", comment: "" });
  };

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
            <div className="flex space-x-3">
              <FormField
                control={form.control}
                name={`table_public`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value === 0 ? false : true}
                        onCheckedChange={() => checkClicked()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>Check if this is a private event</div>
            </div>
            <div className="space-y-6">
              {fieldVendorApp.map((field, index) => {
                return (
                  <div key={field.id}>
                    <FormField
                      control={form.control}
                      name={`vendor_app.${index}.TaC`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Terms and Conditions"
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
                      name={`vendor_app.${index}.comment`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Any other comments?"
                              {...field}
                              className="mt-6"
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
