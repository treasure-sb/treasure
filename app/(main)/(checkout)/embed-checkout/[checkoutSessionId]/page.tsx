import InitializeCheckout from "./components/InitializeCheckout";
import createSupabaseServerClient from "@/utils/supabase/server";
import OrderSummary from "./components/OrderSummary";
import { Tables } from "@/types/supabase";
import { getEventDisplayData, getEventFromId } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { CheckoutTicketInfo } from "../../types";
import { getFeeInfo } from "@/lib/helpers/subscriptions";
import Back from "./components/Back";

export type PriceInfo = {
  subtotal: number;
  promoCode: Tables<"event_codes"> | null;
  priceAfterPromo: number;
  fee: number;
};

const getTicketInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .select("name, price")
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw new Error("Error fetching ticket data");
  }

  return {
    name: ticketData.name,
    price: ticketData.price,
    type: "TICKET" as const,
  };
};

const getTableInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("section_name, price")
    .eq("id", ticketId)
    .single();

  if (tableError) {
    throw new Error("Error fetching table data");
  }
  return {
    name: tableData.section_name,
    price: tableData.price,
    type: "TABLE" as const,
  };
};

export default async function Page({
  params,
}: {
  params: { checkoutSessionId: string };
}) {
  const checkoutSessionId = params.checkoutSessionId;
  const supabase = await createSupabaseServerClient();
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select("*")
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const checkoutSession: Tables<"checkout_sessions"> = checkoutSessionData;
  const {
    event_id,
    ticket_id,
    ticket_type,
    quantity,
    promo_id,
    price_type,
    user_id,
  } = checkoutSession;

  const { event } = await getEventFromId(event_id);

  const eventDisplay = await getEventDisplayData(event);
  const { data: feeData, isLegacy } = await getFeeInfo(event_id);

  const feePercent = feeData?.fee || 0;
  const collectStripeFee = feeData?.collectStripeFee || false;

  let promoCode: Tables<"event_codes"> | null = null;
  if (promo_id) {
    const { data: promoCodeData, error: promoCodeError } = await supabase
      .from("event_codes")
      .select("*")
      .eq("id", promo_id)
      .single();

    if (!promoCodeData || promoCodeError) {
      throw new Error("Invalid promo code");
    }
    promoCode = promoCodeData;
  }

  let subtotal: number;
  let ticket: CheckoutTicketInfo;
  switch (ticket_type) {
    case "TICKET":
      ticket = await getTicketInfo(ticket_id);
      break;
    case "TABLE":
      ticket = await getTableInfo(ticket_id);
      break;
    default:
      throw new Error("Invalid Ticket Type");
  }

  subtotal = ticket.price * quantity;
  let priceAfterPromo = subtotal;

  if (promoCode) {
    if (promoCode.type === "PERCENT") {
      priceAfterPromo = Math.max(
        subtotal - subtotal * (promoCode.discount / 100),
        0
      );
    } else {
      priceAfterPromo = Math.max(subtotal - promoCode.discount, 0);
    }
  }

  const feeAmount = priceAfterPromo * feePercent;
  const stripeFee = collectStripeFee
    ? (priceAfterPromo + feeAmount) * 0.029 + 0.3
    : 0;

  const totalFee =
    price_type === "RSVP" || isLegacy || priceAfterPromo === 0
      ? 0
      : Math.max(feeAmount + stripeFee, 0.5);

  const priceInfo: PriceInfo = {
    subtotal,
    promoCode,
    priceAfterPromo,
    fee: totalFee,
  };

  return (
    <main className="max-w-6xl m-auto">
      <Back cleanedName={event.cleaned_name} />
      <div className="flex flex-col space-y-14 items-center md:flex-row md:items-start md:justify-center md:space-x-20 md:space-y-0">
        <OrderSummary
          event={eventDisplay}
          ticket={ticket}
          checkoutSession={checkoutSession}
          priceInfo={priceInfo}
        />
        <InitializeCheckout
          checkoutSession={checkoutSession}
          event={eventDisplay}
          priceInfo={priceInfo}
        />
      </div>
    </main>
  );
}
