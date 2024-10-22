import createSupabaseServerClient from "@/utils/supabase/server";
import Image from "next/image";
import Blurred from "@/app/(event-page)/events/[name]/components/Blurred";
import Link from "next/link";
import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { EventWithDates } from "@/types/event";
import { HelpingHand, TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import InitializePaymentIntent from "./components/InitializePaymentIntent";

type PriceType = "REGULAR" | "RSVP";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
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

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    checkoutSessionId: string;
  };
  searchParams: { clientSecret: string };
}) {
  const checkoutSessionId = params.checkoutSessionId;
  const clientSecret = searchParams.clientSecret;
  const supabase = await createSupabaseServerClient();
  const { data: checkoutSessionData, error: checkoutSessionError } =
    await supabase
      .from("checkout_sessions")
      .select(
        "*, event:events(*, dates:event_dates(date, start_time, end_time), event_roles(*)), ticket_id, profile:profiles(email), promo:event_codes(*)"
      )
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const event: EventWithDates = checkoutSessionData.event;
  const priceType = checkoutSessionData.price_type as PriceType;
  const eventDisplay = await getEventDisplayData(event);

  let tInfo = await getTicketInfo(checkoutSessionData.ticket_id);

  let price: number =
    checkoutSessionData.promo === null
      ? tInfo.price
      : checkoutSessionData.promo.type === "DOLLAR"
      ? tInfo.price - checkoutSessionData.promo.discount
      : tInfo.price * (1 - checkoutSessionData.promo.discount * 0.01);
  price = price < 0 ? 0 : price;

  const quantity = checkoutSessionData.quantity;

  const ticketInfo: TicketSuccessInformation = {
    ticketName: tInfo.name,
    quantity,
    priceType: priceType,
    amountPaid: price,
  };

  return (
    <main className="max-w-6xl m-auto">
      <InitializePaymentIntent
        checkoutSessionId={checkoutSessionId}
        eventDisplay={eventDisplay}
        ticketInfo={ticketInfo}
        clientSecret={clientSecret}
      />
    </main>
  );
}
