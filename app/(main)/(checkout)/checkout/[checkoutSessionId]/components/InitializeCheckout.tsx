"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Tables } from "@/types/supabase";
import { EventDisplayData } from "@/types/event";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import PromoCode from "./PromoCode";
import FreeCheckout from "./FreeCheckout";
import { useTheme } from "next-themes";

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
  const [price, setPrice] = useState(totalPrice);
  const { theme } = useTheme();
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

  const updatePrice = (newPrice: number) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      amount: Math.round(price * 100),
    }));
  }, [price]);

  const isFree = price === 0;

  return (
    <div className="w-full md:w-[28rem]">
      <div className="mb-2">
        {checkoutSession.price_type === "REGULAR" && (
          <PromoCode
            event={event}
            promoApplied={promoCode}
            checkoutSession={checkoutSession}
            startingPrice={subtotal}
            updatePrice={updatePrice}
          />
        )}
      </div>
      {isFree ? (
        <FreeCheckout
          event={event}
          checkoutSession={checkoutSession}
          profile={profile}
        />
      ) : (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            checkoutSession={checkoutSession}
            profile={profile}
            totalPrice={price}
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
