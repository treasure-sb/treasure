"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { EventDisplayData } from "@/types/event";
import PaymentIntent from "./PaymentIntent";

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
