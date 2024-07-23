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
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventForm } from "@/types/event";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Function to validate time format (HH:mm)
function isValidTime(value: string) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(value);
}

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  eventForm: EventForm;
  setEventForm: Dispatch<SetStateAction<EventForm>>;
}

const vendorInfoSchema = z.object({
  check_in_time: z.string().refine((value) => isValidTime(value), {
    message: "Must be a valid time (HH:mm)",
  }),
  check_in_location: z.string().min(1, {
    message: "Location is required",
  }),
  wifi_availability: z.boolean().default(false),
  additional_information: z.string().optional(),
  terms: z.array(
    z.object({
      term_id: z.number(),
      term: z.string().min(1, { message: "Term and Condition Required" }),
    }),
  ),
});

export default function EventVendorInfo({
  onNext,
  onBack,
  eventForm,
  setEventForm,
}: Step3Props) {
  const form = useForm<z.infer<typeof vendorInfoSchema>>({
    resolver: zodResolver(vendorInfoSchema),
    mode: "onBlur",
    defaultValues: {
      check_in_time: eventForm.application_vendor_information.check_in_time,
      check_in_location:
        eventForm.application_vendor_information.check_in_location,
      wifi_availability:
        eventForm.application_vendor_information.wifi_availability,
      additional_information:
        eventForm.application_vendor_information.additional_information,
      terms: eventForm.application_vendor_information.terms,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "terms",
  });
  const [numTerms, setNumTerms] = useState(1);

  const handleNext = () => {
    const newForm = {
      ...eventForm,
      application_vendor_information: {
        check_in_time: form.getValues().check_in_time,
        check_in_location: form.getValues().check_in_location,
        wifi_availability: form.getValues().wifi_availability,
        additional_information: form.getValues().additional_information,
        terms: form.getValues().terms,
      },
    };
    setEventForm(newForm);
    onNext();
  };

  const addTerm = () => {
    append({ term_id: numTerms + 1, term: "" });
    setNumTerms(numTerms + 1);
  };

  const removeTerm = () => {
    remove(numTerms - 1);
    setNumTerms(numTerms - 1);
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleNext)}
          className="flex flex-col justify-between h-full gap-6"
        >
          <div className="flex flex-col gap-6">
            <div className="text-lg font-semibold text-primary">
              Information for Vendors
            </div>
            <FormField
              control={form.control}
              name="check_in_time"
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
              name="check_in_location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Vendor check in location (Ex. Front Entrance)"
                      {...field}
                    />
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
                name={`wifi_availability`}
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
              <div>There will be free wifi for vendors</div>
            </div>
            <FormField
              control={form.control}
              name="additional_information"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Additional information for vendors (Optional)"
                      {...field}
                    />
                  </FormControl>
                  <div className="h-1">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div>Vendor Terms and Conditions</div>
            <ul className="w-full flex flex-col pl-5">
              {fields.map((field, index) => {
                return (
                  <li className="list-outside list-disc" key={field.id}>
                    <FormField
                      control={form.control}
                      name={`terms.${index}.term`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Vendor Terms and Conditions"
                              {...field}
                            />
                          </FormControl>
                          <div className="h-1">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="flex gap-4">
              <Button onClick={addTerm} type="button" variant={"secondary"}>
                Add Term
              </Button>{" "}
              {numTerms > 1 && (
                <Button
                  type="button"
                  onClick={removeTerm}
                  variant={"secondary"}
                >
                  Remove Term
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
