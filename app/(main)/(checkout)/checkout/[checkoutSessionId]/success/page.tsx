import InitializePaymentIntent from "./components/InitializePaymentIntent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

type PriceType = "REGULAR" | "RSVP";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
  email: string;
  type: "TICKET" | "TABLE";
  priceType: PriceType;
  amountPaid: number;
}

const getTicketInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .select("name, price")
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw new Error("Error fetching ticket name");
  }

  return ticketData;
};

const getTableInfo = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("name:section_name, price")
    .eq("id", ticketId)
    .single();

  if (tableError) {
    throw new Error("Error fetching table name");
  }
  return tableData;
};

export default async function Page({
  params,
}: {
  params: {
    checkoutSessionId: string;
  };
}) {
  const checkoutSessionId = params.checkoutSessionId;
  const supabase = await createSupabaseServerClient();
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select(
        "*, event:events(*), ticket_id, profile:profiles(email), promo:event_codes(*)"
      )
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const event: Tables<"events"> = checkoutSessionData.event;
  const priceType = checkoutSessionData.price_type as PriceType;
  const eventDisplay = await getEventDisplayData(event);

  let tInfo: any;
  let ticketName: string;
  let type: "TICKET" | "TABLE";
  let price: number;
  switch (checkoutSessionData.ticket_type) {
    case "TICKET":
      tInfo = await getTicketInfo(checkoutSessionData.ticket_id);
      ticketName = tInfo.name;
      price = tInfo.price;
      type = "TICKET";
      break;
    case "TABLE":
      tInfo = await getTableInfo(checkoutSessionData.ticket_id);
      ticketName = tInfo.name;
      price = tInfo.price;
      type = "TABLE";
      break;
    default:
      throw new Error("Invalid Ticket Type");
  }

  price =
    price -
    checkoutSessionData.promo.discount *
      (checkoutSessionData.promo.type === "DOLLAR" ? 1 : 0.01);
  price = price < 0 ? 0 : price;

  const quantity = checkoutSessionData.quantity;
  const email = checkoutSessionData.profile.email;

  const ticketInfo: TicketSuccessInformation = {
    ticketName,
    quantity,
    email,
    type,
    priceType: priceType,
    amountPaid: price,
  };

  return (
    <main className="max-w-6xl m-auto">
      <InitializePaymentIntent
        checkoutSessionId={checkoutSessionId}
        eventDisplay={eventDisplay}
        ticketInfo={ticketInfo}
      />
    </main>
  );
}
