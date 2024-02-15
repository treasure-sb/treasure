"use client";

import { EventDisplayData } from "@/types/event";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import Link from "next/link";
import EventDisplay from "@/components/events/shared/EventDisplay";

export default function PaymentIntent({
  eventDisplay,
}: {
  eventDisplay: EventDisplayData;
}) {
  const [message, setMessage] = useState<null | string>(null);
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    const getPaymentIntent = async (clientSecret: string) => {
      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret
      );
      if (!paymentIntent) {
        return;
      }
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    };
    getPaymentIntent(clientSecret);
  }, [stripe]);

  return (
    <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10">
      <div className="border-[1px] border-foreground/20 rounded-lg space-y-6 p-6 w-full md:max-w-2xl m-auto">
        <h1 className="text-center font-semibold text-2xl">
          Thanks for your order!
        </h1>
        <h2 className="text-tertiary text-center">
          1x GA ticket sent to george@ontreasure.xyz
        </h2>
        <div className="w-[60%] m-auto">
          <EventDisplay event={eventDisplay} showLikeButton={false} />
        </div>
        <div className="flex justify-center">
          <Link href="/profile/tickets">
            <Button className="rounded-lg w-40" variant={"tertiary"}>
              View Tickets
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
