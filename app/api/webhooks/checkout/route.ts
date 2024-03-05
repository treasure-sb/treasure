import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendTicketPurchasedEmail } from "@/lib/actions/emails";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { getEventFromId } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import moment from "moment";
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

const generateOrder = async (user_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id }])
    .select();

  if (error) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }
  return data[0];
};

const handleTicketPurchase = async (
  checkoutSessison: Tables<"checkout_sessions">,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { event_id, ticket_id, user_id, quantity } = checkoutSessison;
  const { data: ticketData } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticket_id)
    .single();

  const ticket: Tables<"tickets"> = ticketData;
  const { data: purchasedTicketData, error: purchasedTicketError } =
    await supabase
      .from("event_tickets")
      .insert({ attendee_id: user_id, event_id, ticket_id })
      .select();

  console.log(purchasedTicketData, purchasedTicketError);
  if (!purchasedTicketData || purchasedTicketError) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }

  const purchasedTicket: Tables<"event_tickets"> = purchasedTicketData[0];
  const { profile } = await getProfile(user_id);
  const { event } = await getEventFromId(event_id);
  const posterUrl = await getPublicPosterUrl(event);

  // generate emails props
  const emailProps = {
    eventName: event.name,
    posterUrl,
    ticketType: ticket.name,
    quantity: quantity,
    location: event.address,
    date: moment(event.date).format("dddd, MMM Do"),
    guestName: `${profile.first_name} ${profile.last_name}`,
    totalPrice: `$${ticketData.price}`,
    eventInfo: event.description,
  };

  if (profile.email) {
    await sendTicketPurchasedEmail(
      profile.email,
      purchasedTicket.id,
      event_id,
      emailProps
    );
  }
};

const handleTablePurchase = async (
  checkoutSession: Tables<"checkout_sessions">,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { event_id, user_id } = checkoutSession;
  await supabase
    .from("event_vendors")
    .update({ payment_status: "PAID" })
    .eq("event_id", event_id)
    .eq("vendor_id", user_id);
};

const handlePaymentIntentSucceeded = async (
  event: Stripe.PaymentIntentSucceededEvent
) => {
  const supabase = await createSupabaseServerClient();
  const session = event.data.object;
  const { checkoutSessionId } = JSON.parse(JSON.stringify(session.metadata));
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select("*")
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError || !checkoutSessionData) {
    throw new Error("Invalid Checkout Session");
  }

  const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
  switch (checkoutSession.ticket_type) {
    case "TICKET":
      await handleTicketPurchase(checkoutSession, supabase);
      break;
    case "TABLE":
      await handleTablePurchase(checkoutSession, supabase);
      break;
    default:
      throw new Error("Invalid Ticket Type");
  }
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

    if (event.type === "payment_intent.succeeded") {
      await handlePaymentIntentSucceeded(
        event as Stripe.PaymentIntentSucceededEvent
      );
    }
    return NextResponse.json({
      result: "Payment Intent Succeeded",
      ok: true,
    });
  } catch (err) {
    return NextResponse.json({
      message: "An error has occurred",
      ok: false,
    });
  }
}
