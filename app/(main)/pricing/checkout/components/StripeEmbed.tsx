import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function StripeEmbed({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const options = {
    clientSecret,
  };
  return (
    <>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </>
  );
}
