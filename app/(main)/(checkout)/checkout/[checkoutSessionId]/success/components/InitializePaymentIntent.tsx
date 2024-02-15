"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentIntent from "./PaymentIntent";
import { Tables } from "@/types/supabase";
import { EventDisplayData } from "@/types/event";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function InitializePaymentIntent({
  eventDisplay,
}: {
  eventDisplay: EventDisplayData;
}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentIntent eventDisplay={eventDisplay} />
    </Elements>
  );
}
