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
import { Database, Json, Tables } from "@/types/supabase";
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

type PurchaseTableResult =
  Database["public"]["Functions"]["purchase_table"]["Returns"][number];

type PurchaseTicketResult =
  Database["public"]["Functions"]["purchase_tickets"]["Returns"][number];

type DinnerSelections = {
  dinnerSelections: string[];
  isSampa: boolean;
};

function formatDinnerSelections(metadata: {
  [key: string]: Json | undefined;
}): string {
  if (metadata && metadata.dinnerSelections) {
    const json: DinnerSelections = metadata as DinnerSelections;
    return json.dinnerSelections.join(", ");
  } else {
    return "";
  }
}

const handleTicketPurchase = async (
  checkoutSessison: Tables<"checkout_sessions">,
  amountPaid: number,
  supabase: SupabaseClient<any, "public", any>,
  email: string
) => {
  const { event_id, ticket_id, user_id, quantity, promo_id, metadata } =
    checkoutSessison;

  const { data, error } = await supabase
    .rpc("purchase_tickets", {
      ticket_id,
      event_id,
      user_id,
      purchase_quantity: quantity,
      email,
      amount_paid: amountPaid,
      metadata,
      promo_id,
    })
    .returns<PurchaseTicketResult[]>();

  if (error) {
    throw new Error("Error purchasing tickets");
  }

  const {
    event_address,
    event_cleaned_name,
    event_organizer_id,
    event_date,
    event_description,
    event_name,
    event_poster_url,
    event_ticket_ids,
    ticket_name,
    ticket_price,
  } = data[0];

  const { profile } = await getProfile(user_id);
  const purchasedTicketId =
    event_ticket_ids.length > 1 ? event_ticket_ids : event_ticket_ids[0];
  const host = await getProfile(event_organizer_id);
  const posterUrl = await getPublicPosterUrlFromPosterUrl(event_poster_url);

  const ticketPurchaseEmailProps = {
    eventName: event_name,
    posterUrl,
    ticketType: ticket_name,
    quantity: quantity,
    location: event_address,
    date: moment(event_date).format("dddd, MMM Do"),
    guestName: `${profile.first_name} ${profile.last_name}`,
    totalPrice: `$${ticket_price * quantity}`,
    eventInfo: event_description,
    dinnerSelection: formatDinnerSelections(
      metadata as { [key: string]: Json | undefined }
    ),
  };
  if (profile.email) {
    await sendTicketPurchasedEmail(
      profile.email,
      purchasedTicketId,
      event_id,
      ticketPurchaseEmailProps
    );
  }

  if (profile.phone) {
    await sendAttendeeTicketPurchasedSMS(profile.phone, event_name, event_date);
  }

  if (host.profile && host.profile.phone) {
    const hostSMSPayload: HostSoldPayload = {
      phone: host.profile.phone,
      businessName: profile.business_name,
      firstName: profile.first_name,
      lastName: profile.last_name,
      eventName: event_name,
      eventDate: event_date,
      eventCleanedName: event_cleaned_name,
      quantity: quantity,
    };
    await sendHostTicketSoldSMS(hostSMSPayload);
  }

  if (!profile.email || profile.role !== "admin") {
    await sendTicketPurchasedEmail(
      "treasure20110@gmail.com",
      purchasedTicketId,
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
  const { event_id, user_id, quantity, ticket_id, promo_id } = checkoutSession;

  const { data, error } = await supabase
    .rpc("purchase_table", {
      table_id: ticket_id,
      event_id,
      user_id,
      purchase_quantity: quantity,
      amount_paid: amountPaid,
      promo_id,
    })
    .returns<PurchaseTableResult[]>();

  if (error) {
    throw new Error("Error purchasing table");
  }

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
  } = data[0];

  const host = await getProfile(organizer_id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event_poster_url, {
    transform: {
      width: 400,
      height: 400,
    },
  });

  const tablePurchasedEmailPayload: TablePurchasedProps = {
    eventName: event_name,
    posterUrl: publicUrl,
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

  if (host.profile && host.profile.phone) {
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

  if (
    vendor_application_email !== "treasure20110@gmail.com" ||
    (host.profile && host.profile.role !== "admin")
  ) {
    await sendTablePurchasedEmail(
      "treasure20110@gmail.com",
      tablePurchasedEmailPayload
    );
  }
};

const handlePaymentIntentSucceeded = async (
  event: Stripe.PaymentIntentSucceededEvent
) => {
  const supabase = await createSupabaseServerClient();
  const session = event.data.object;
  const { checkoutSessionId, priceAfterPromo, email, promoCode } = JSON.parse(
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
      await handleTicketPurchase(
        checkoutSession,
        priceAfterPromo,
        supabase,
        email
      );
      break;
    case "TABLE":
      await handleTablePurchase(checkoutSession, priceAfterPromo, supabase);
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
