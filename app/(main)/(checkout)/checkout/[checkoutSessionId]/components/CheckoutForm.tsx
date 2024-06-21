"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { createClient } from "@/utils/supabase/client";
import StripeInput from "./StripeInput";

const nameSchema = z.object({
  first_name: z.string().min(1, {
    message: "First Name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last Name is required",
  }),
});

export default function CheckoutForm({
  checkoutSession,
  profile,
}: {
  checkoutSession: Tables<"checkout_sessions">;
  profile: Tables<"profiles">;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      first_name: profile.first_name === "Anonymous" ? "" : profile.first_name,
      last_name: profile.first_name === "Anonymous" ? "" : profile.last_name,
    },
  });

  const handleSubmit = async (e: any) => {
    const supabase = createClient();
    const { first_name, last_name } = form.getValues();
    const { error: updateNameError } = await supabase
      .from("profiles")
      .update({ first_name, last_name })
      .eq("id", profile.id)
      .select();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    toast.loading("Processing payment...");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/${checkoutSession.id}/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      toast.dismiss();
      toast.error(error.message);
    } else {
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        id="payment-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full md:w-96 space-y-4"
      >
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
        <PaymentElement id="payment-element" />
        <div className="w-full flex items-center justify-center">
          <Button
            className={`rounded-sm ${isLoading && "bg-primary/60"}`}
            disabled={isLoading || !stripe || !elements}
            id="submit"
          >
            Purchase{" "}
            {checkoutSession.ticket_type === "TABLE" ? "Table" : "Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
