import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { stripeLink } from "@/lib/actions/stripe";
import StripeEmbed from "./StripeEmbed";

export default async function InitializeStripe({ origin }: { origin: string }) {
  const returnUrl = `${origin}/pricing/checkout/success`;
  const clientSecret = await stripeLink(returnUrl);

  return (
    <StripeEmbed clientSecret={clientSecret === null ? " " : clientSecret} />
  );
}
