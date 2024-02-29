import InitializePaymentIntent from "./components/InitializePaymentIntent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getTicketInfo, getTableInfo } from "../page";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
  email: string;
}

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
      .select("*, event:events(*), ticket_id, profile:profiles(email)")
      .eq("id", checkoutSessionId)
      .single();

  if (checkoutSessionError) {
    redirect("/events");
  }

  const event: Tables<"events"> = checkoutSessionData.event;
  const eventDisplay = await getEventDisplayData(event);

  let ticketName: string;
  switch (checkoutSessionData.ticket_type) {
    case "TICKET":
      const ticketInfo = await getTicketInfo(checkoutSessionData.ticket_id);
      ticketName = ticketInfo.name;
      break;
    case "TABLE":
      const tableInfo = await getTableInfo(checkoutSessionData.ticket_id);
      ticketName = tableInfo.name;
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
  };

  return (
    <main className="max-w-6xl m-auto">
      <InitializePaymentIntent
        eventDisplay={eventDisplay}
        ticketInfo={ticketInfo}
      />
    </main>
  );
}
