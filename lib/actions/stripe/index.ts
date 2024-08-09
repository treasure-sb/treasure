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
  promoCode: string
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

const stripeLink = async (returnUrl: string) => {
  const {
    data: { user },
  } = await validateUser();

  if (user) {
    user.email == null && true; //EnterEmailModal;
  }
  const searchData = await stripe.customers.search({
    query: `email:\'${user?.email}\'`,
  });
  let customer: any;
  if (searchData && searchData.data.length == 0) {
    customer = await stripe.customers.create({
      email: user?.email,
      phone: user?.phone,
    });
  } else {
    customer = searchData.data[0];
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: "price_1PjqNfHnRCFO3bhFJArayp7A",
        quantity: 1,
      },
    ],
    ui_mode: "embedded",
    return_url: returnUrl,
    metadata: {
      plan: "Pro",
      priceId: "price_1PjqNfHnRCFO3bhFJArayp7A",
      user_id: (
        await validateUser()
      ).data.user?.id
        ? (await validateUser()).data.user?.id ||
          ((
            await validateUser()
          ).data.user?.id as string)
        : "",
    },
  });
  let clientSecret = session.client_secret;
  return clientSecret;
};

export {
  createPaymentIntent,
  createStripeProduct,
  updatePaymentIntent,
  stripeLink,
};
