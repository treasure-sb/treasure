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
import { submitVendorApp } from "@/lib/actions/vendors/submit-application";

const applicationSchema = z.object({
  collection_type: z.string().min(1, {
    message: "Collection type is required",
  }),
  contact: z.string().min(1, {
    message: "Contact is required",
  }),
  checkbox: z
    .boolean()
    .default(false)
    .refine(
      (bool) => {
        return bool;
      },
      {
        message: "Must agree to the terms and conditions",
      }
    ),
});

export default function ApplicationForm({
  toc,
  comment,
  event_id,
}: {
  toc: string;
  comment: string;
  event_id: string;
}) {
  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    mode: "onBlur",
  });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    const newForm = {
      collection_type: form.getValues().collection_type,
      contact: form.getValues().contact,
      event_id: event_id,
    };
    await submitVendorApp(newForm);
    console.log("submitted");
    setSubmitting(false);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <FormField
            control={form.control}
            name={`contact`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="What is the best way to contact you?"
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
          <FormField
            control={form.control}
            name={`collection_type`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="What kinds of cards do you collect?"
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

          <div className="flex flex-col sm:flex-row w-full justify-around gap-6 my-8">
            {comment !== "" && (
              <div className="w-full">
                <h1 className="text-xl font-semibold mb-2">
                  Additional comments from host
                </h1>
                <h2 className="text-sm sm:text-base">{comment}</h2>
              </div>
            )}
            <div className="w-full">
              <h1 className="text-xl font-semibold mb-2">
                Terms and Conditions
              </h1>
              <h2 className="text-sm sm:text-base">
                {toc !== ""
                  ? toc
                  : "You have the right to remain silent. Anything you say can be used against you in court. You have the right to talk to a lawyer for advice before we ask you any questions. You have the right to have a lawyer with you during questioning."}
              </h2>
            </div>
          </div>
          <div>
            <div className="flex space-x-3">
              <FormField
                control={form.control}
                name={`checkbox`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="absolute">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div>Accept terms and conditions</div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full py-6 my-10"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
