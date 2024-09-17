"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { EventDisplayData } from "@/types/event";
import PaymentIntent from "./PaymentIntent";
import { TicketSuccessInformation } from "../page";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function InitializePaymentIntent({
  eventDisplay,
  ticketInfo,
  checkoutSessionId,
}: {
  eventDisplay: EventDisplayData;
  ticketInfo: TicketSuccessInformation;
  checkoutSessionId: string;
}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentIntent
        eventDisplay={eventDisplay}
        ticketInfo={ticketInfo}
        checkoutSessionId={checkoutSessionId}
      />
    </Elements>
  );
}
