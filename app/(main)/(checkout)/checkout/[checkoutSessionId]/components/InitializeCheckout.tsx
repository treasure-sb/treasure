"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tables } from "@/types/supabase";
import CheckoutForm from "./CheckoutForm";
import PromoCode from "./PromoCode";
import { EventDisplayData } from "@/types/event";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function InitializeCheckout({
  checkoutSession,
  priceAfterPromo,
  subtotal,
  event,
  profile,
  promoCode,
}: {
  checkoutSession: Tables<"checkout_sessions">;
  priceAfterPromo: number;
  subtotal: number;
  event: EventDisplayData;
  profile: Tables<"profiles">;
  promoCode: Tables<"event_codes"> | null;
}) {
  const [price, setPrice] = useState(priceAfterPromo);
  const [options, setOptions] = useState({
    mode: "payment" as const,
    amount: Math.round(price * 100),
    currency: "usd",
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimaryText: "#f2f2f2",
        colorPrimary: "#71d08c",
        colorBackground: "#0c0a09",
        fontFamily: "Inter, sans-serif",
        fontSizeSm: "16px",
      },
    },
  });

  const updatePrice = (newPrice: number) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      amount: Math.round(price * 100),
    }));
  }, [price]);

  return (
    <div className="w-full md:w-[28rem]">
      <div className="mb-2">
        <PromoCode
          event={event}
          promoApplied={promoCode}
          checkoutSession={checkoutSession}
          startingPrice={subtotal}
          updatePrice={updatePrice}
        />
      </div>
      <Elements options={options} stripe={stripePromise}>
        <CheckoutForm
          checkoutSession={checkoutSession}
          profile={profile}
          totalPrice={price}
        />
      </Elements>
    </div>
  );
}
