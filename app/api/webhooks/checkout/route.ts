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
import { PurchaseTicketResult } from "@/types/tickets";
import { PurchaseTableResult } from "@/types/tables";
import { formatEmailDate } from "@/lib/utils";
import createSupabaseServerClient from "@/utils/supabase/server";
import Cors from "micro-cors";
import Stripe from "stripe";
import { secondsToISODate } from "@/lib/helpers/stripeHelp";

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const stripeSecret = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string;
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET as string;

if (!stripeSecret || !webhookSecret) {
  throw new Error("Stripe environment variables are not set.");
}

const stripe = new Stripe(stripeSecret);

type DinnerSelections = {
  dinnerSelections: string[];
  isSampa: boolean;
};

type TeamData = {
  role: string;
  status: string;
  profile: {
    phone: string;
    email: string;
  };
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
  email: string,
  fees_paid?: number
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
      fees_paid,
    })
    .returns<PurchaseTicketResult[]>();

  if (error) {
    throw new Error("Error purchasing tickets");
  }

  const {
    event_address,
    event_cleaned_name,
    event_dates,
    event_description,
    event_name,
    event_poster_url,
    event_ticket_ids,
    ticket_name,
  } = data[0];

  const { profile } = await getProfile(user_id);
  const purchasedTicketId =
    event_ticket_ids.length > 1 ? event_ticket_ids : event_ticket_ids[0];
  const posterUrl = await getPublicPosterUrlFromPosterUrl(event_poster_url);
  const numericAmountPaid = Number(amountPaid);
  const numericFeesPaid = Number(fees_paid);

  // Now perform the addition
  const totalPaid = fees_paid
    ? numericAmountPaid + numericFeesPaid
    : numericAmountPaid;
  const formattedEventDate = formatEmailDate(event_dates);

  const ticketPurchaseEmailProps = {
    eventName: event_name,
    posterUrl,
    ticketType: ticket_name,
    quantity: quantity,
    location: event_address,
    date: formattedEventDate,
    guestName: `${profile.first_name} ${profile.last_name}`,
    totalPrice: `$${totalPaid}`,
    eventInfo: event_description,
    dinnerSelection: formatDinnerSelections(
      metadata as { [key: string]: Json | undefined }
    ),
    fees_paid: fees_paid,
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
    await sendAttendeeTicketPurchasedSMS(
      profile.phone,
      event_name,
      formattedEventDate
    );
  }

  const { data: teamData } = await supabase
    .from("event_roles")
    .select("role, status, profile:profiles(phone, email)")
    .eq("event_id", event_id)
    .in("role", ["HOST", "COHOST", "STAFF"])
    .returns<TeamData[]>();

  const teamPhoneNumbers = teamData
    ? teamData.map((member) => member.profile.phone).filter(Boolean)
    : [];

  if (teamPhoneNumbers.length > 0) {
    const hostSMSPayload: HostSoldPayload = {
      phones: teamPhoneNumbers,
      businessName: profile.business_name,
      firstName: profile.first_name,
      lastName: profile.last_name,
      eventName: event_name,
      eventDate: formattedEventDate,
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
  supabase: SupabaseClient<any, "public", any>,
  fees_paid?: number
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
      fees_paid,
    })
    .returns<PurchaseTableResult[]>();

  if (error) {
    throw new Error("Error purchasing table");
  }

  const {
    event_name,
    event_address,
    event_cleaned_name,
    event_max_date,
    event_min_date,
    event_description,
    event_poster_url,
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

  const event_dates = [event_min_date, event_max_date];

  if (event_min_date === event_max_date) {
    event_dates.pop();
  }

  const formattedEventDate = formatEmailDate(event_dates);

  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event_poster_url, {
    transform: {
      width: 400,
      height: 400,
    },
  });
  const numericFeesPaid = Number(fees_paid);
  const numericAmountPaid = Number(amountPaid);
  // Now perform the addition
  const totalPaid = fees_paid
    ? numericAmountPaid + numericFeesPaid
    : numericAmountPaid;
  const tablePurchasedEmailPayload: TablePurchasedProps = {
    eventName: event_name,
    posterUrl: publicUrl,
    tableType: table_section_name,
    quantity: vendor_table_quantity,
    location: event_address,
    date: formattedEventDate,
    guestName: `${vendor_first_name} ${vendor_last_name}`,
    businessName: vendor_business_name,
    itemInventory: vendor_inventory,
    totalPrice: `$${totalPaid}`,
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
    formattedEventDate
  );

  const { data: teamData } = await supabase
    .from("event_roles")
    .select("role, status, profile:profiles(phone, email)")
    .eq("event_id", event_id)
    .in("role", ["HOST", "COHOST", "STAFF"])
    .returns<TeamData[]>();

  const teamPhoneNumbers = teamData
    ? teamData.map((member) => member.profile.phone).filter(Boolean)
    : [];

  if (teamPhoneNumbers.length > 0) {
    const hostSMSPayload: HostSoldPayload = {
      phones: teamPhoneNumbers,
      businessName: vendor_business_name,
      firstName: vendor_first_name,
      lastName: vendor_last_name,
      eventName: event_name,
      eventDate: formattedEventDate,
      eventCleanedName: event_cleaned_name,
    };
    await sendHostTableSoldSMS(hostSMSPayload);
  }

  if (vendor_application_email !== "treasure20110@gmail.com") {
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

  const { checkoutSessionId, priceAfterPromo, promoCode, email, fees_paid } =
    JSON.parse(JSON.stringify(session.metadata));

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
        email,
        fees_paid
      );
      break;
    case "TABLE":
      await handleTablePurchase(
        checkoutSession,
        priceAfterPromo,
        supabase,
        fees_paid
      );
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
