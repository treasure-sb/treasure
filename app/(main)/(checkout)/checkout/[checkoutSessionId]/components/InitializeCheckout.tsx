"use client";

import { createPaymentIntent } from "@/lib/actions/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Tables } from "@/types/supabase";
import CheckoutForm from "./CheckoutForm";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function InitializeCheckout({
  checkoutSession,
  totalPrice,
  profile,
}: {
  checkoutSession: Tables<"checkout_sessions">;
  totalPrice: number;
  profile: Tables<"profiles">;
}) {
  const { refresh } = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const paymentIntent = await createPaymentIntent(
        totalPrice,
        checkoutSession.id
      );
      const secret = paymentIntent?.clientSecret || "";
      const id = paymentIntent?.id || "";
      setClientSecret(secret);
      const { data, error } = await supabase
        .from("checkout_sessions")
        .update({ payment_intent_id: id })
        .eq("id", checkoutSession.id);
      refresh();
    };
    fetchPaymentIntent();
  }, [totalPrice]);

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimaryText: "#f2f2f2",
      colorPrimary: "#71d08c",
      colorBackground: "#0c0a09",
      fontFamily: "Raleway, sans-serif",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm checkoutSession={checkoutSession} profile={profile} />
        </Elements>
      )}
    </>
  );
}
