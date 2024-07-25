import InitializePaymentIntent from "./components/InitializePaymentIntent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { EventWithDates } from "@/types/event";

type PriceType = "REGULAR" | "RSVP";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
  email: string;
  type: "TICKET" | "TABLE";
  priceType: PriceType;
}

const getTicketName = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: ticketData, error: ticketError } = await supabase
    .from("tickets")
    .select("name")
    .eq("id", ticketId)
    .single();

  if (ticketError) {
    throw new Error("Error fetching ticket name");
  }

  return ticketData.name;
};

const getTableName = async (ticketId: string) => {
  const supabase = await createSupabaseServerClient();
  const { data: tableData, error: tableError } = await supabase
    .from("tables")
    .select("section_name")
    .eq("id", ticketId)
    .single();

  if (tableError) {
    throw new Error("Error fetching table name");
  }
  return tableData.section_name;
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
        "*, event:events(*, event_dates(date, start_time, end_time)), ticket_id, profile:profiles(email)"
      )
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const event: EventWithDates = checkoutSessionData.event;
  const priceType = checkoutSessionData.price_type as PriceType;
  const eventDisplay = await getEventDisplayData(event);

  let ticketName: string;
  let type: "TICKET" | "TABLE";
  switch (checkoutSessionData.ticket_type) {
    case "TICKET":
      ticketName = await getTicketName(checkoutSessionData.ticket_id);
      type = "TICKET";
      break;
    case "TABLE":
      ticketName = await getTableName(checkoutSessionData.ticket_id);
      type = "TABLE";
      break;
    default:
      throw new Error("Invalid Ticket Type");
  }

  const quantity = checkoutSessionData.quantity;
  const email = checkoutSessionData.profile.email;

  const ticketInfo: TicketSuccessInformation = {
    ticketName,
    quantity,
    email,
    type,
    priceType: priceType,
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
