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
    amount: Math.round(totalPrice * 100),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      checkoutSessionId,
      amountPaid: totalPrice,
    },
  });

  return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
};

const updatePaymentIntent = async (
  paymentIntentId: string,
  newAmount: number
) => {
  try {
    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        amount: newAmount * 100,
        metadata: {
          amountPaid: newAmount,
        },
      }
    );

    console.log(updatedPaymentIntent);
    return {
      clientSecret: updatedPaymentIntent.client_secret,
      id: updatedPaymentIntent.id,
    };
  } catch (error) {
    console.error("Error updating payment intent:", error);
    throw error;
  }
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

export { createPaymentIntent, createStripeProduct, updatePaymentIntent };
