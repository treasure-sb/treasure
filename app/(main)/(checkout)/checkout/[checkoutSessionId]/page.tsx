import InitializeCheckout from "./components/InitializeCheckout";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getEventDisplayData } from "@/lib/helpers/events";
import { Separator } from "@/components/ui/separator";
import { TicketIcon } from "lucide-react";
import { redirect } from "next/navigation";
import EventCard from "@/components/events/shared/EventCard";

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
  const { event_id, ticket_id, quantity } = checkoutSession;
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplay = await getEventDisplayData(event);

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticket_id)
    .single();
  const ticket: Tables<"tickets"> = ticketData;

  return (
    <main className="max-w-6xl m-auto">
      <div className="flex flex-col space-y-20 items-center md:flex-row md:items-start md:justify-center md:space-x-20 md:space-y-0">
        <div className="space-y-4 w-full md:w-96">
          <div className="w-full">
            <EventCard showLikeButton={false} event={eventDisplay} />
          </div>
          <div>
            <p className="text-lg">Order summary</p>
            <Separator className="my-3" />
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <TicketIcon className="text-tertiary stroke-1" size={24} />
                <p>
                  {ticket.name} x {quantity}
                </p>
              </div>
              <p>$19.00</p>
            </div>
          </div>
        </div>
        <InitializeCheckout />
      </div>
    </main>
  );
}
