import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  useStripe,
} from "@stripe/react-stripe-js";
import { stripeLink } from "@/lib/actions/stripe";
import StripeEmbed from "./StripeEmbed";

export default async function InitializeStripe({ origin }: { origin: string }) {
  // const returnUrl = `${origin}/pricing/checkout/success`;
  const returnUrl = "http://localhost:3000/pricing/checkout/success";
  const clientSecret = await stripeLink(returnUrl);

  return (
    <StripeEmbed clientSecret={clientSecret === null ? " " : clientSecret} />
  );
}
