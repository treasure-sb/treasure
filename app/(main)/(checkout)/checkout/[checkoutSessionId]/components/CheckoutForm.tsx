"use client";

import { Button } from "@/components/ui/button";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { toast } from "sonner";

export default function CheckoutForm({
  checkoutSession,
}: {
  checkoutSession: Tables<"checkout_sessions">;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="w-full md:w-96 space-y-8"
    >
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
  );
}
