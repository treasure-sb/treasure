"use client";

import { EventDisplayData } from "@/types/event";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TicketSuccessInformation } from "../page";
import { TicketIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import EventDisplay from "@/components/events/shared/EventDisplay";

export default function PaymentIntent({
  eventDisplay,
  ticketInfo,
}: {
  eventDisplay: EventDisplayData;
  ticketInfo: TicketSuccessInformation;
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
          toast.success("Your payment was successful.");
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

  const { quantity, ticketName, email, type } = ticketInfo;
  const isTicket = type === "TICKET";

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-semibold mb-10">
        Thank you for your order
      </h1>
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10 items-center justify-center">
        <div className="bg-primary w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-lg flex flex-col items-center justify-center text-background">
          <div className="text-center mb-10">
            <TicketIcon className="w-20 h-20 stroke-1 m-auto" />
            <h2 className="font-bold text-3xl md:text-5xl">You're Going!</h2>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg md:text-2xl">
              {eventDisplay.name}
            </p>
            <p className="text-md md:text-lg">
              {moment(eventDisplay.date).format("dddd, MMM Do")}
            </p>
          </div>
        </div>
        <div className="border-[1px] border-foreground/20 rounded-lg w-80 h-80 md:w-[30rem] md:h-[30rem] m-auto flex flex-col justify-between p-3 md:p-6">
          <p className="mx-auto font-semibold text-sm md:text-base text-center">
            {quantity}x {ticketName}{" "}
            {isTicket
              ? ticketInfo.quantity > 1
                ? "tickets"
                : "ticket"
              : ticketInfo.quantity > 1
              ? "tables"
              : "table"}{" "}
            sent to <span className="font-bold">{email}</span>
          </p>
          <div className="w-52 md:w-80 mx-auto">
            <div className="aspect-w-1 aspect-h-1">
              <Image
                className="rounded-xl my-auto"
                alt="event poster image"
                objectFit="cover"
                src={eventDisplay.publicPosterUrl}
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/profile/tickets">
              <Button className="rounded-lg w-32 md:w-40">
                View {isTicket ? "Tickets" : "Tables"}{" "}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
