"use server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

interface Ticket {
  name: string;
  price: string;
  poster_url: string;
}

const createCheckoutSession = async (
  price_id: string | null,
  user_id: string | undefined,
  event_id: string,
  ticket_id: string,
  redirect_domain: string,
  quantity: number
) => {
  if (!price_id || !user_id) return;
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price: price_id,
        quantity,
      },
    ],
    metadata: {
      user_id,
      event_id,
      ticket_id,
      quantity,
    },
    mode: "payment",
    return_url: `${redirect_domain}/return?session_id={CHECKOUT_SESSION_ID}`,
  });
  return { clientSecret: session.client_secret };
};

const createPaymentIntent = async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return { clientSecret: paymentIntent.client_secret };
};

const createStripeProduct = async (ticket: Ticket) => {
  const { name, price, poster_url } = ticket;
  const product = await stripe.products.create({
    name,
    default_price_data: {
      currency: "usd",
      unit_amount: parseFloat(price) * 100,
    },
    images: [poster_url],
  });
  return product;
};

export { createCheckoutSession, createPaymentIntent, createStripeProduct };
