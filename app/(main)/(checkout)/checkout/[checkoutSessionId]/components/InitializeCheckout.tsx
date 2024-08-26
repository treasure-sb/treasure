"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tables } from "@/types/supabase";
import { EventDisplayData } from "@/types/event";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import CheckoutForm from "./CheckoutForm";
import PromoCode from "./PromoCode";
import FreeCheckout from "./FreeCheckout";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function InitializeCheckout({
  checkoutSession,
  totalPrice,
  subtotal,
  priceAfterPromo,
  event,
  profile,
  promoCode,
  fee,
}: {
  checkoutSession: Tables<"checkout_sessions">;
  totalPrice: number;
  subtotal: number;
  priceAfterPromo: number;
  event: EventDisplayData;
  profile: Tables<"profiles">;
  promoCode: Tables<"event_codes"> | null;
  fee?: number;
}) {
  const priceToCharge = totalPrice + (fee || 0);

  const { theme } = useTheme();
  const [options, setOptions] = useState({
    mode: "payment" as const,
    amount: Math.round(priceToCharge * 100),
    currency: "usd",
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimaryText: "#f2f2f2",
        colorPrimary: "#71d08c",
        colorBackground: "#0c0a09",
        colorText: "#f2f2f2",
        fontFamily: "Inter, sans-serif",
        fontSizeSm: "16px",
      },
    },
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      appearance: {
        ...prevOptions.appearance,
        variables: {
          ...prevOptions.appearance.variables,
          colorPrimary: theme === "light" ? "#2aaa88" : "#71d08c",
          colorBackground: theme === "light" ? "#fafaf5" : "#0c0a09",
          colorText: theme === "light" ? "#0c0a09" : "#f2f2f2",
        },
      },
    }));
  }, [theme]);

  const isFree = priceToCharge === 0;

  return (
    <div className="w-full md:w-[28rem]">
      <div className="mb-2">
        {checkoutSession.price_type === "REGULAR" && (
          <PromoCode
            event={event}
            promoApplied={promoCode}
            checkoutSession={checkoutSession}
            startingPrice={subtotal}
          />
        )}
      </div>
      {isFree ? (
        <FreeCheckout checkoutSession={checkoutSession} profile={profile} />
      ) : (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            checkoutSession={checkoutSession}
            profile={profile}
            totalPrice={priceToCharge}
            subtotal={subtotal}
            priceAfterPromo={priceAfterPromo}
            promoCode={promoCode}
            fee={fee}
          />
        </Elements>
      )}
    </div>
  );
}
