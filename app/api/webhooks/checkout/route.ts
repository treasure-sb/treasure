import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  sendTicketPurchasedEmail,
  sendTablePurchasedEmail,
} from "@/lib/actions/emails";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { getEventFromId } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { TablePurchasedProps } from "@/emails/TablePurchased";
import moment from "moment";
import createSupabaseServerClient from "@/utils/supabase/server";
import Cors from "micro-cors";
import Stripe from "stripe";
import { sendSMS } from "@/lib/actions/twilio";

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
  const ticketsToInsert = Array.from({ length: quantity }).map(() => {
    return { attendee_id: user_id, event_id, ticket_id };
  });

  const { data: purchasedTicketData, error: purchasedTicketError } =
    await supabase.from("event_tickets").insert(ticketsToInsert).select();

  if (!purchasedTicketData || purchasedTicketError) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }

  const purchasedTicket: Tables<"event_tickets"> = purchasedTicketData[0];
  const { profile } = await getProfile(user_id);
  const { event } = await getEventFromId(event_id);
  const host = await getProfile(event.organizer_id);
  const posterUrl = await getPublicPosterUrl(event);

  const ticketPurchaseEmailProps = {
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

  // send email to user
  if (profile.email !== null) {
    await sendTicketPurchasedEmail(
      profile.email,
      purchasedTicket.id,
      event_id,
      ticketPurchaseEmailProps
    );
  }

  // send email to us
  if (profile.email === null || profile.email !== "treasure20110@gmail.com") {
    await sendTicketPurchasedEmail(
      "treasure20110@gmail.com",
      purchasedTicket.id,
      event_id,
      ticketPurchaseEmailProps
    );
  }

  // text user
  if (profile.phone !== null) {
    await sendSMS(
      profile.phone,
      `🙌 You’re going to ${event.name} on ${moment(event.date).format(
        "dddd, MMM Do"
      )}!\n\nView details and your tickets\n\n🎟️ ontreasure.xyz/tickets"`
    );
  }

  // text host
  if (host.profile.phone !== null) {
    await sendSMS(
      host.profile.phone,
      `🎉 ${
        profile.business_name === null
          ? profile.first_name + " " + profile.last_name
          : profile.business_name
      } just bought a ticket to ${event.name} on ${moment(event.date).format(
        "dddd, MMM Do"
      )}!\n\nView details\n\nontreasure.xyz/host/events/${event.cleaned_name}`
    );
  }

  // text us
  await sendSMS(
    "+17039097887",
    `🎉 ${
      profile.business_name === null
        ? profile.first_name + " " + profile.last_name
        : profile.business_name
    } just bought a ticket to ${event.name} on ${moment(event.date).format(
      "dddd, MMM Do"
    )}!\n\nView details\n\nontreasure.xyz/host/events/${event.cleaned_name}`
  );
};

const handleTablePurchase = async (
  checkoutSession: Tables<"checkout_sessions">,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { event_id, user_id } = checkoutSession;
  const { data: updateVendorData, error: updateVendorError } = await supabase
    .from("event_vendors")
    .update({ payment_status: "PAID" })
    .eq("event_id", event_id)
    .eq("vendor_id", user_id)
    .select("*, events(*), profiles(*), tables(*)")
    .single();

  if (updateVendorError) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }

  const vendorProfile: Tables<"profiles"> = updateVendorData.profiles;
  const event: Tables<"events"> = updateVendorData.events;
  const table: Tables<"tables"> = updateVendorData.tables;
  const host = await getProfile(event.organizer_id);
  const posterUrl = await getPublicPosterUrl(event);

  const tablePurchasedEmailPayload: TablePurchasedProps = {
    eventName: event.name,
    posterUrl: posterUrl,
    tableType: table.section_name,
    quantity: updateVendorData.table_quantity,
    location: event.address,
    date: moment(event.date).format("dddd, MMM Do"),
    guestName: `${vendorProfile.first_name} ${vendorProfile.last_name}`,
    businessName: vendorProfile.business_name,
    itemInventory: updateVendorData.inventory,
    totalPrice: `$${updateVendorData.table_quantity * table.price}`,
    numberOfVendors: updateVendorData.vendors_at_table,
    eventInfo: event.description,
  };

  const { error: sendTablePurchasedEmailError } = await sendTablePurchasedEmail(
    updateVendorData.application_email,
    tablePurchasedEmailPayload
  );
  if (updateVendorData.application_email !== "treasure20110@gmail.com") {
    const { error: sendAdminTablePurchasedEmailError } =
      await sendTablePurchasedEmail(
        "treasure20110@gmail.com",
        tablePurchasedEmailPayload
      );
  }

  // text user
  if (vendorProfile.phone !== null) {
    await sendSMS(
      vendorProfile.phone,
      `🙌 Success! Yoour vendor payment has been received! You are now confirmed to be a vendor at ${
        event.name
      } on ${moment(event.date).format(
        "dddd, MMM Do"
      )}. We look forward to seeing you there!\n\nView details and your tickets\n\n🎟️ ontreasure.xyz/tickets"`
    );
  }

  // text host
  if (host.profile.phone !== null) {
    await sendSMS(
      host.profile.phone,
      `💰Congrats! You received payment from ${
        vendorProfile.business_name === null
          ? vendorProfile.first_name + " " + vendorProfile.last_name
          : vendorProfile.business_name
      } Their table(s) are confirmed for ${event.name} on ${moment(
        event.date
      ).format(
        "dddd, MMM Do"
      )}!\n\nView details\n\nontreasure.xyz/host/events/${event.cleaned_name}`
    );
  }

  // text us
  await sendSMS(
    "+17039097887",
    `💰Congrats! You received payment from ${
      vendorProfile.business_name === null
        ? vendorProfile.first_name + " " + vendorProfile.last_name
        : vendorProfile.business_name
    } Their table(s) are confirmed for ${event.name} on ${moment(
      event.date
    ).format("dddd, MMM Do")}!\n\nView details\n\nontreasure.xyz/host/events/${
      event.cleaned_name
    }`
  );

  if (sendTablePurchasedEmailError) {
    console.log(sendTablePurchasedEmailError);
  }
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
