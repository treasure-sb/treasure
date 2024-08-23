import { NextResponse } from "next/server";
import {
  sendTicketPurchasedEmail,
  sendTablePurchasedEmail,
} from "@/lib/actions/emails";
import { getPublicPosterUrlFromPosterUrl } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { Database, Json, Tables } from "@/types/supabase";
import { Subscription, SupabaseClient } from "@supabase/supabase-js";
import { TablePurchasedProps } from "@/emails/TablePurchased";
import {
  type HostSoldPayload,
  sendAttendeeTicketPurchasedSMS,
  sendHostTicketSoldSMS,
  sendVendorTablePurchasedSMS,
  sendHostTableSoldSMS,
} from "@/lib/sms";
import { headers } from "next/headers";
import moment from "moment";
import createSupabaseServerClient from "@/utils/supabase/server";
import Cors from "micro-cors";
import Stripe from "stripe";
import { secondsToISODate } from "@/lib/helpers/stripeHelp";
import { validateUser } from "@/lib/actions/auth";
import { date } from "zod";

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
  const basic_id = await supabase
    .from("subscription_products")
    .select("id")
    .eq("name", "Basic")
    .single();
  const subscription_deletion = await supabase
    .from("subscriptions")
    .delete()
    .eq("stripe_subscription_id", invoice.subscription)
    .select("user_id")
    .single();
  const basic_creation = await supabase.from("subscriptions").insert({
    user_id: subscription_deletion,
    start_date: new Date().toISOString(),
    subscribed_product_id: basic_id,
    created_at: new Date().toISOString(),
    updated_at: "new Date().toISOString()",
    status: "ACTIVE",
  });
};

const handleSupscriptionCreationOrRenewal = async (
  session: Stripe.InvoicePaidEvent
) => {
  const supabase = await createSupabaseServerClient();
  const invoice = session.data.object;
  //think this is broken
  const payment_intent = await stripe.paymentIntents.retrieve(
    session.data.object.payment_intent as string
  );
  const { checkoutSessionId, priceAfterPromo, promoCode, email, fees_paid } =
    JSON.parse(JSON.stringify(payment_intent.metadata));
  const checkoutSessionMetadata = (
    await stripe.checkout.sessions.retrieve(checkoutSessionId)
  ).metadata;

  const { plan, priceId, user_id } = JSON.parse(
    JSON.stringify(checkoutSessionMetadata)
  );
  const product_id = (
    await supabase
      .from("subscription_products")
      .select("id")
      .eq("name", "Pro")
      .single()
  ).data?.id;

  const isRenewal = await supabase
    .from("subscriptions")
    .select("*", { count: "exact" })
    .eq("user_id", user_id)
    .eq("subscribed_product_id", product_id)
    .then((return1) => {
      if (return1.count) {
        let isRenew = return1.count > 0 ? true : false;
        return isRenew;
      } else {
        return false;
      }
    });
  let subscription_id;
  if (isRenewal) {
    const { data, error } = await supabase
      .from("subscription")
      .update({
        updated_at: new Date().toISOString(),
        start_date: secondsToISODate(invoice.lines.data[0].period.start),
        end_date: secondsToISODate(invoice.lines.data[0].period.start),
      })
      .eq("stripe_subscription_id", invoice.subscription);
    const invoice_supabase_creation = await supabase
      .from("subscription_invoices")
      .insert({
        subscription_id: subscription_id ? subscription_id : "",
        stripe_invoice_id: invoice.id,
        amount_paid: invoice.amount_paid / 100,
        paid_on: secondsToISODate(session.created),
      });
  } else {
    let duplicate_deletion = await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", user_id);

    subscription_id = await supabase
      .from("subscriptions")
      .insert({
        user_id: user_id,
        subscribed_product_id: product_id,
        stripe_subscription_id: invoice.subscription,
        status: "ACTIVE",
        start_date: secondsToISODate(invoice.lines.data[0].period.start),
        end_date: secondsToISODate(invoice.lines.data[0].period.end),
        created_at: invoice.lines.data[0].plan?.created
          ? secondsToISODate(invoice.lines.data[0].plan?.created)
          : null,
        updated_at: null,
      })
      .select()
      .maybeSingle();
  }
  subscription_id = invoice.subscription;
  const invoice_supabase_creation = await supabase
    .from("subscription_invoices")
    .insert({
      subscription_id: subscription_id ? subscription_id : "",
      stripe_invoice_id: invoice.id,
      amount_paid: invoice.amount_paid / 100,
      paid_on: secondsToISODate(session.created),
    });

  console.log(subscription_id);
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
      handleSubscriptionPaymentFailed(
        event as Stripe.InvoicePaymentFailedEvent
      );
    } else if (event.type === "invoice.paid") {
      try {
        handleSupscriptionCreationOrRenewal(event as Stripe.InvoicePaidEvent);
      } catch (err) {
        console.error("Subscription Creation or Renewal Error");
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
