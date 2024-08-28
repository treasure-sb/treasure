"use server";
import { Stripe } from "stripe";
import { validateUser } from "@/lib/actions/auth";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);

interface Ticket {
  name: string;
  price: string;
  poster_url: string;
}

const createPaymentIntent = async (
  totalPrice: number,
  subtotal: number,
  priceAfterPromo: number,
  checkoutSessionId: string,
  email: string,
  promoCode: string,
  fee: number
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      checkoutSessionId,
      subtotal,
      priceAfterPromo,
      promoCode,
      email,
      fees_paid: fee.toFixed(2),
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

const subscriptionStripeLink = async (returnUrl: string) => {
  const {
    data: { user },
  } = await validateUser();
  let searchData;
  if (user?.email && user) {
    searchData = await stripe.customers.search({
      query: `email:\'${user?.email}\'`,
    });
  }

  let customer: Stripe.Customer;
  if (searchData && searchData.data.length == 0) {
    customer = await stripe.customers.create({
      email: user?.email,
      phone: user?.phone,
    });
  } else if (searchData) {
    customer = searchData.data[0];
  }

  const user_id = user?.id || "";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price:
          process.env.NODE_ENV === "development"
            ? "price_1PjqNfHnRCFO3bhFJArayp7A"
            : "price_1PjPhmHnRCFO3bhFbMk9u5Uz",
        quantity: 1,
      },
    ],
    ui_mode: "embedded",
    return_url: returnUrl,
    metadata: {
      plan: "Pro",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1PjqNfHnRCFO3bhFJArayp7A"
          : "price_1PjPhmHnRCFO3bhFbMk9u5Uz",
      user_id: user_id,
    },
  });

  let clientSecret = session.client_secret;
  return clientSecret;
};

export {
  createPaymentIntent,
  createStripeProduct,
  updatePaymentIntent,
  subscriptionStripeLink as stripeLink,
};
