import InitializePaymentIntent from "./components/InitializePaymentIntent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

export interface TicketSuccessInformation {
  ticketName: string;
  quantity: number;
  email: string;
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
      ticketName = await getTicketName(checkoutSessionData.ticket_id);
      break;
    case "TABLE":
      ticketName = await getTableName(checkoutSessionData.ticket_id);
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
