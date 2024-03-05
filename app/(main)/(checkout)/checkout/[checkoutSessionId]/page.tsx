import InitializeCheckout from "./components/InitializeCheckout";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/shared/EventCard";
import { Tables } from "@/types/supabase";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Separator } from "@/components/ui/separator";
import { TicketIcon } from "lucide-react";
import { redirect } from "next/navigation";

interface CheckoutTicketInfo {
  name: string;
  price: number;
}

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
  const { event_id, ticket_id, ticket_type, quantity } = checkoutSession;
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplay = await getEventDisplayData(event);

  let totalPrice = 0;
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

  totalPrice = ticket.price * quantity;

  return (
    <main className="max-w-6xl m-auto">
      <div className="flex flex-col space-y-20 items-center md:flex-row md:items-start md:justify-center md:space-x-20 md:space-y-0">
        <div className="space-y-4 w-full md:w-96">
          <div className="w-full">
            <EventCard
              clickable={false}
              showLikeButton={false}
              event={eventDisplay}
            />
          </div>
          <div>
            <p className="text-lg">Order summary</p>
            <Separator className="my-3" />
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <TicketIcon className="text-tertiary stroke-1" size={24} />
                <p>
                  {ticket.name} {ticket_type === "TABLE" && <span>Table</span>}{" "}
                  x {quantity}
                </p>
              </div>
              <p>{`$${totalPrice.toFixed(2)}`}</p>
            </div>
          </div>
        </div>
        <InitializeCheckout
          checkoutSession={checkoutSession}
          totalPrice={totalPrice}
        />
      </div>
    </main>
  );
}
