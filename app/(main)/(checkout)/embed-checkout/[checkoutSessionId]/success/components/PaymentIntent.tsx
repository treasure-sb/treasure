"use client";

import { EventDisplayData } from "@/types/event";
import { useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TicketSuccessInformation } from "../page";
import { HelpingHand, LucideHeartHandshake, TicketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Loading from "./Loading";
import Blurred from "@/app/(event-page)/events/[name]/components/Blurred";
import BlurredRed from "./BlurredRed";

export default function PaymentIntent({
  eventDisplay,
  ticketInfo,
  checkoutSessionId,
}: {
  eventDisplay: EventDisplayData;
  ticketInfo: TicketSuccessInformation;
  checkoutSessionId: string;
}) {
  const [status, setStatus] = useState<"loading" | "success" | "failure">(
    ticketInfo.priceType === "RSVP"
      ? "success"
      : ticketInfo.amountPaid === 0
      ? "success"
      : "loading"
  );
  const stripe = useStripe();

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret || !stripe) {
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
          setStatus("success");
          toast.success("Your payment was successful.");
          break;
        case "requires_payment_method":
          setStatus("failure");
          toast.error(
            "Payment failed. Please try again with a different payment method."
          );
          break;
        default:
          setStatus("failure");
          toast.error("An error occurred. Please try again later");
          break;
      }
    };
    getPaymentIntent(clientSecret);
  }, [stripe]);

  const { quantity, ticketName } = ticketInfo;

  return (
    <AnimatePresence mode="wait">
      {status === "loading" && <Loading key="loading" />}
      {status !== "loading" && (
        <>
          <motion.div
            key="payment-intent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.35 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-2xl md:text-3xl font-semibold mb-6 mt-4">
              {status === "success"
                ? "Thank you for your order"
                : "Payment Failed"}
            </h1>
            <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10 items-center justify-center">
              <div
                className={cn(
                  `w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-lg flex flex-col items-center justify-center text-background`,
                  status === "success" ? "bg-primary" : "bg-red-500"
                )}
              >
                <div className="text-center mb-10 text-foreground dark:text-background">
                  {eventDisplay.id ===
                  "3733a7f4-365f-4912-bb24-33dcb58f2a19" ? (
                    <HelpingHand className="w-20 h-20 stroke-1 m-auto" />
                  ) : (
                    <TicketIcon className="w-20 h-20 stroke-1 m-auto" />
                  )}

                  <h2 className="font-bold text-3xl md:text-5xl">
                    {status === "failure"
                      ? "Please try again"
                      : eventDisplay.id ===
                        "3733a7f4-365f-4912-bb24-33dcb58f2a19"
                      ? "Thank You!"
                      : "You're Going!"}
                  </h2>
                </div>
                <div className="text-center text-foreground dark:text-background">
                  <p className="font-semibold text-lg md:text-2xl">
                    {eventDisplay.name}
                  </p>
                </div>
                {status === "failure" && (
                  <Link href={`/embed-checkout/${checkoutSessionId}`}>
                    <Button
                      className="rounded-lg w-32 md:w-40 mt-6 text-background font-semibold underline"
                      variant={"link"}
                    >
                      Try Again
                    </Button>
                  </Link>
                )}
              </div>
              {status === "success" && (
                <div className="border-[1px] border-foreground/20 rounded-lg w-80 h-80 md:w-[30rem] md:h-[30rem] m-auto flex flex-col justify-between p-3 md:p-6">
                  {eventDisplay.id !==
                    "3733a7f4-365f-4912-bb24-33dcb58f2a19" && (
                    <p className="mx-auto font-semibold text-sm md:text-base text-center">
                      <span className="text-muted-foreground text-sm">
                        {quantity}x
                      </span>{" "}
                      {ticketName} {quantity > 1 ? "tickets" : "ticket"} added
                      to your account
                    </p>
                  )}

                  <div className="w-52 md:w-80 mx-auto">
                    <div className="aspect-w-1 aspect-h-1">
                      <Image
                        className="rounded-xl my-auto object-cover object-top"
                        alt="event poster image"
                        src={eventDisplay.publicPosterUrl}
                        width={1000}
                        height={1000}
                        priority
                      />
                    </div>
                  </div>
                  {eventDisplay.id !==
                    "3733a7f4-365f-4912-bb24-33dcb58f2a19" && (
                    <div className="flex justify-center">
                      <Link href="/login">
                        <Button className="rounded-sm w-fit">
                          Sign up to access your tickets
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          {status === "success" && (
            <Blurred
              posterUrl={eventDisplay.publicPosterUrl}
              opacity={0.07}
              marginX={false}
            />
          )}
          {status === "failure" && <BlurredRed />}
        </>
      )}
    </AnimatePresence>
  );
}
