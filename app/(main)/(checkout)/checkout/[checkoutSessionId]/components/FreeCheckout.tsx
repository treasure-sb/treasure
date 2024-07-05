"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import * as z from "zod";
import StripeInput from "./StripeInput";
import { addEventAttendee } from "@/lib/actions/tickets";
import { EventDisplayData } from "@/types/event";
import { useRouter } from "next/navigation";

const nameSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export default function FreeCheckout({
  event,
  checkoutSession,
  profile,
}: {
  event: EventDisplayData;
  checkoutSession: Tables<"checkout_sessions">;
  profile: Tables<"profiles">;
}) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: profile.first_name === "Anonymous" ? "" : profile.first_name,
      last_name: profile.first_name === "Anonymous" ? "" : profile.last_name,
      email: profile.email || "",
    },
  });

  const onSubmit = async () => {
    const { first_name, last_name, email } = form.getValues();
    await supabase
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", profile.id);

    setIsLoading(true);
    toast.loading("Getting ticket...");

    const { error } = await addEventAttendee(
      event.id,
      profile.id,
      checkoutSession.ticket_id,
      checkoutSession.quantity,
      email
    );

    if (error) {
      setIsLoading(false);
      toast.error("Failed to get ticket");
      return;
    }

    setIsLoading(false);
    toast.dismiss();
    toast.success(
      `Ticket${checkoutSession.quantity > 1 && "s"} added successfully!`
    );
    push(`/checkout/${checkoutSession.id}/success`);
  };

  return (
    <Form {...form}>
      <form
        id="payment-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <StripeInput placeholder="John" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <StripeInput placeholder="Doe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <StripeInput placeholder="john@gmail.com" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            className={`rounded-sm ${isLoading && "bg-primary/60"}`}
            disabled={isLoading}
            id="submit"
          >
            Get Ticket{checkoutSession.quantity > 1 && "s"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
