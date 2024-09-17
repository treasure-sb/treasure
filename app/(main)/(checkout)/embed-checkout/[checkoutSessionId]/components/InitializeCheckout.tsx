"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tables } from "@/types/supabase";
import { EventDisplayData } from "@/types/event";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PriceInfo } from "../page";
import CheckoutForm, { CheckoutPriceInfo } from "./CheckoutForm";
import PromoCode from "./PromoCode";
import FreeCheckout from "./FreeCheckout";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

type InitializeCheckoutProps = {
  checkoutSession: Tables<"checkout_sessions">;
  event: EventDisplayData;
  priceInfo: PriceInfo;
};

export default function InitializeCheckout({
  checkoutSession,
  event,
  priceInfo,
}: InitializeCheckoutProps) {
  const { subtotal, promoCode, priceAfterPromo, fee } = priceInfo;
  const priceToCharge = priceAfterPromo + (fee || 0);
  const isFree = priceToCharge === 0;

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

  const checkoutPriceInfo: CheckoutPriceInfo = { ...priceInfo, priceToCharge };

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
        <FreeCheckout checkoutSession={checkoutSession} />
      ) : (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            checkoutSession={checkoutSession}
            checkoutPriceInfo={checkoutPriceInfo}
          />
        </Elements>
      )}
    </div>
  );
}
