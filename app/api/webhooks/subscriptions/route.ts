import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { secondsToISODate } from "@/lib/helpers/stripeHelp";
import createSupabaseServerClient from "@/utils/supabase/server";
import Cors from "micro-cors";
import Stripe from "stripe";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const stripeSecret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string;
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

if (!stripeSecret || !webhookSecret) {
  throw new Error("Stripe environment variables are not set.");
}

const stripe = new Stripe(stripeSecret);

const handleSubscriptionPaymentFailed = async (
  session: Stripe.InvoicePaymentFailedEvent
) => {
  const supabase = await createSupabaseServerClient();
  const invoice = session.data.object;
  const { data: basicId, error: myError } = await supabase
    .from("subscription_products")
    .select("id")
    .eq("name", "Basic")
    .single();
  const { data: subscriptionDeletion, error: subDelError } = await supabase
    .from("subscriptions")
    .delete()
    .eq("stripe_subscription_id", invoice.subscription);
  const checkout_session = await stripe.checkout.sessions.list({
    subscription: invoice.subscription as string,
    limit: 1,
  });
  const metadata = checkout_session.data[0].metadata;
  const {
    plan,
    priceId,
    user_id: userId,
  } = JSON.parse(JSON.stringify(metadata));
  const { data: basicCreationData, error: basicCreationError } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      subscribed_product_id: basicId?.id,
      status: "ACTIVE",
    });
};

const handleSubscriptionCreationOrRenewal = async (
  session: Stripe.InvoicePaidEvent
) => {
  const supabase = await createSupabaseServerClient();
  const invoice = session.data.object;
  const checkoutSession = await stripe.checkout.sessions.list({
    subscription: invoice.subscription as string,
    limit: 1,
  });
  const metadata = checkoutSession.data[0].metadata;
  const {
    plan,
    priceId,
    user_id: userId,
  } = JSON.parse(JSON.stringify(metadata));
  const { data: productIdData, error: ProductIdError } = await supabase
    .from("subscription_products")
    .select("id")
    .eq("name", "Pro")
    .single();
  const productId = productIdData?.id;
  const isRenewal = await supabase
    .from("subscriptions")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("subscribed_product_id", productId)
    .then((return1) => {
      if (return1.count) {
        return true;
      } else {
        return false;
      }
    });
  let subscriptionId;
  if (isRenewal) {
    const { data, error } = await supabase
      .from("subscriptions")
      .update({
        updated_at: new Date().toISOString(),
        start_date: secondsToISODate(invoice.lines.data[0].period.start),
        end_date: secondsToISODate(invoice.lines.data[0].period.end),
      })
      .eq("user_id", userId)
      .select("id")
      .single();

    if (data) {
      subscriptionId = data.id;
    }
  } else {
    const { data: subscriptionDeletion, error: subDelError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", userId);

    const { data: subscriptionIdData, error: subIdError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        subscribed_product_id: productId,
        stripe_subscription_id: invoice.subscription,
        status: "ACTIVE",
        start_date: secondsToISODate(invoice.lines.data[0].period.start),
        end_date: secondsToISODate(invoice.lines.data[0].period.end),
        created_at: invoice.lines.data[0].plan?.created
          ? secondsToISODate(invoice.lines.data[0].plan?.created)
          : null,
        updated_at: null,
      })
      .select("id")
      .single();
    subscriptionId = subscriptionIdData?.id ? subscriptionIdData?.id : "";
  }
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("subscription_invoices")
    .insert({
      subscription_id: subscriptionId,
      stripe_invoice_id: invoice.id,
      amount_paid: invoice.amount_paid / 100,
      paid_on: secondsToISODate(session.created),
    });
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type == "invoice.payment_failed") {
      await handleSubscriptionPaymentFailed(
        event as Stripe.InvoicePaymentFailedEvent
      );
    } else if (event.type === "invoice.paid") {
      try {
        handleSubscriptionCreationOrRenewal(event as Stripe.InvoicePaidEvent);
        return NextResponse.json({
          message: "Webhook processed successfully",
          ok: true,
        });
      } catch (err) {
        console.error("Subscription Creation or Renewal Error");
        return NextResponse.json({
          message: "Webhook error:",
          err,
          ok: false,
        });
      }
    } else {
      return NextResponse.json({
        message: "Invalid Event Type",
        ok: false,
      });
    }
  } catch (err) {
    return NextResponse.json({
      message: "An error has occurred",
      ok: false,
    });
  }
}
