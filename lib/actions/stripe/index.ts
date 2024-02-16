"use server";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

interface Ticket {
  name: string;
  price: string;
  poster_url: string;
}

const createPaymentIntent = async (
  totalPrice: number,
  checkoutSessionId: string
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      checkoutSessionId,
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

export { createPaymentIntent, createStripeProduct };
