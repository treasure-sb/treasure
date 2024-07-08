import { NextResponse } from "next/server";
import {
  sendTicketPurchasedEmail,
  sendTablePurchasedEmail,
} from "@/lib/actions/emails";
import {
  getPublicPosterUrl,
  getPublicPosterUrlFromPosterUrl,
} from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { getEventFromId } from "@/lib/helpers/events";
import { Database, Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
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

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const stripeSecret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string;
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

if (!stripeSecret || !webhookSecret) {
  throw new Error("Stripe environment variables are not set.");
}

const stripe = new Stripe(stripeSecret);

type OrderPayload = {
  userId: string;
  eventId: string;
  quantity: number;
  price: number;
  itemId: string;
  itemType: "TICKET" | "TABLE";
  metadata?: any;
};

type PurchaseTableResult =
  Database["public"]["Functions"]["purchase_table"]["Returns"][number];

const createOrder = async (orderPayload: OrderPayload) => {
  const supabase = await createSupabaseServerClient();
  const { userId, eventId, quantity, price, itemId, itemType, metadata } =
    orderPayload;
  const { data: createOrderData, error: createOrderError } = await supabase
    .from("orders")
    .insert([
      {
        customer_id: userId,
        amount_paid: price,
        event_id: eventId,
        metadata,
      },
    ])
    .select()
    .single();

  const order: Tables<"orders"> = createOrderData;

  if (createOrderError) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }

  const { error: createLineItemsError } = await supabase
    .from("line_items")
    .insert([
      {
        order_id: order.id,
        item_type: itemType,
        item_id: itemId,
        quantity: quantity,
        price: price / quantity,
      },
    ]);

  if (createLineItemsError) {
    return NextResponse.json({
      message: "Error",
      ok: false,
    });
  }
  return null;
};

const handleTicketPurchase = async (
  checkoutSessison: Tables<"checkout_sessions">,
  amountPaid: number,
  supabase: SupabaseClient<any, "public", any>,
  email: string
) => {
  const { event_id, ticket_id, user_id, quantity, promo_id, metadata } =
    checkoutSessison;

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticket_id)
    .single();

  const ticket: Tables<"tickets"> = ticketData;

  if (ticket.quantity < quantity) {
    throw new Error("Not enough tickets available");
  }

  const { error: updatedTicketError } = await supabase
    .from("tickets")
    .update({ quantity: ticket.quantity - quantity })
    .eq("id", ticket_id);

  if (updatedTicketError) {
    throw new Error("Error updating ticket quantity");
  }

  const ticketsToInsert = Array.from({ length: quantity }).map(() => {
    return { attendee_id: user_id, event_id, ticket_id, email };
  });
  const { data: purchasedTicketData, error: purchasedTicketError } =
    await supabase.from("event_tickets").insert(ticketsToInsert).select();

  if (!purchasedTicketData || purchasedTicketError) {
    await supabase
      .from("tickets")
      .update({ quantity: ticket.quantity })
      .eq("id", ticket_id);

    throw new Error("Error inserting purchased tickets");
  }

  const createOrderPayload = {
    userId: user_id,
    eventId: event_id,
    quantity: quantity,
    price: amountPaid,
    itemId: ticket.id,
    itemType: "TICKET" as const,
    metadata,
  };
  await createOrder(createOrderPayload);

  if (promo_id) {
    const { data: promoData, error: promoError } = await supabase
      .from("event_codes")
      .select("num_used")
      .eq("id", promo_id)
      .single();

    if (promoError || !promoData) {
      throw new Error("Error fetching promo code data");
    }

    const newNumUsed = promoData.num_used + 1;

    const { error: updatePromoError } = await supabase
      .from("event_codes")
      .update({ num_used: newNumUsed })
      .eq("id", promo_id);

    if (updatePromoError) {
      throw new Error("Error updating promo code usage");
    }
  }

  const { profile } = await getProfile(user_id);
  const { event } = await getEventFromId(event_id);
  const purchasedTicket: Tables<"event_tickets"> = purchasedTicketData[0];
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
    totalPrice: `$${ticket.price * quantity}`,
    eventInfo: event.description,
  };

  if (profile.email) {
    await sendTicketPurchasedEmail(
      profile.email,
      purchasedTicket.id,
      event_id,
      ticketPurchaseEmailProps
    );
  }

  if (profile.phone) {
    await sendAttendeeTicketPurchasedSMS(profile.phone, event.name, event.date);
  }

  if (host.profile && host.profile.phone) {
    const hostSMSPayload: HostSoldPayload = {
      phone: host.profile.phone,
      businessName: profile.business_name,
      firstName: profile.first_name,
      lastName: profile.last_name,
      eventName: event.name,
      eventDate: event.date,
      eventCleanedName: event.cleaned_name,
    };
    await sendHostTicketSoldSMS(hostSMSPayload);
  }

  if (!profile.email || profile.role !== "admin") {
    await sendTicketPurchasedEmail(
      "treasure20110@gmail.com",
      purchasedTicket.id,
      event_id,
      ticketPurchaseEmailProps
    );
  }
};

const handleTablePurchase = async (
  checkoutSession: Tables<"checkout_sessions">,
  amountPaid: number,
  supabase: SupabaseClient<any, "public", any>
) => {
  const { event_id, user_id, quantity, ticket_id } = checkoutSession;

  const { data, error } = await supabase
    .rpc("purchase_table", {
      table_id: ticket_id,
      event_id,
      user_id,
      purchase_quantity: quantity,
    })
    .returns<PurchaseTableResult>();

  if (error) {
    throw new Error("Error purchasing table");
  }

  const tableData = data;
  const {
    organizer_id,
    event_name,
    event_address,
    event_cleaned_name,
    event_date,
    event_description,
    event_poster_url,
    table_price,
    table_section_name,
    vendor_table_quantity,
    vendor_first_name,
    vendor_last_name,
    vendor_inventory,
    vendor_vendors_at_table,
    vendor_business_name,
    vendor_application_email,
    vendor_application_phone,
  } = tableData;

  const host = await getProfile(organizer_id);
  const posterUrl = await getPublicPosterUrlFromPosterUrl(event_poster_url);
  const tablePurchasedEmailPayload: TablePurchasedProps = {
    eventName: event_name,
    posterUrl: posterUrl,
    tableType: table_section_name,
    quantity: vendor_table_quantity,
    location: event_address,
    date: moment(event_date).format("dddd, MMM Do"),
    guestName: `${vendor_first_name} ${vendor_last_name}`,
    businessName: vendor_business_name,
    itemInventory: vendor_inventory,
    totalPrice: `$${quantity * table_price}`,
    numberOfVendors: vendor_vendors_at_table,
    eventInfo: event_description,
  };

  await sendTablePurchasedEmail(
    vendor_application_email,
    tablePurchasedEmailPayload
  );

  await sendVendorTablePurchasedSMS(
    vendor_application_phone,
    event_name,
    event_date
  );

  if (host.profile.phone) {
    const hostSMSPayload: HostSoldPayload = {
      phone: host.profile.phone,
      businessName: vendor_business_name,
      firstName: vendor_first_name,
      lastName: vendor_last_name,
      eventName: event_name,
      eventDate: event_date,
      eventCleanedName: event_cleaned_name,
    };
    await sendHostTableSoldSMS(hostSMSPayload);
  }

  // if (
  //   vendor_application_email !== "treasure20110@gmail.com" ||
  //   host.profile.role !== "admin"
  // ) {
  //   await sendTablePurchasedEmail(
  //     "treasure20110@gmail.com",
  //     tablePurchasedEmailPayload
  //   );
  // }
};

const handlePaymentIntentSucceeded = async (
  event: Stripe.PaymentIntentSucceededEvent
) => {
  const supabase = await createSupabaseServerClient();
  const session = event.data.object;
  const { checkoutSessionId, amountPaid, email } = JSON.parse(
    JSON.stringify(session.metadata)
  );

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
      await handleTicketPurchase(checkoutSession, amountPaid, supabase, email);
      break;
    case "TABLE":
      await handleTablePurchase(checkoutSession, amountPaid, supabase);
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
      try {
        await handlePaymentIntentSucceeded(
          event as Stripe.PaymentIntentSucceededEvent
        );
        return NextResponse.json({
          message: "Payment Intent Succeeded",
          ok: true,
        });
      } catch (err) {
        console.log(err);
        await stripe.refunds.create({ payment_intent: event.data.object.id });
        console.error("Failed to process post-payment actions:", err);
        return NextResponse.json({
          message: "An error has occurred",
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
