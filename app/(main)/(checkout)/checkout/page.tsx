"use client";

import { createCheckoutSession } from "@/lib/actions/stripe";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

interface SearchParams {
  price_id: string;
  user_id: string;
  event_id: string;
  ticket_id: string;
  quantity: number;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const { price_id, user_id, event_id, ticket_id, quantity } = searchParams;
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      const redirect_domain = window.location.origin;
      const checkoutSession = await createCheckoutSession(
        price_id,
        user_id,
        event_id,
        ticket_id,
        redirect_domain,
        quantity
      );
      const secret = checkoutSession?.clientSecret || "";
      setClientSecret(secret);
    };
    fetchCheckoutSession();
  }, []);

  return (
    <main className="max-w-6xl m-auto">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </main>
  );
}
