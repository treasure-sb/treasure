import AnalyticsCard from "./AnalyticsCard";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const eventCleanedName = params.id;
  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromCleanedName(eventCleanedName);
  if (eventError) {
    redirect("/events");
  }

  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .single();

  const tickets: Tables<"tickets">[] = ticketsData;

  return (
    <main className="m-auto max-w-lg">
      <div className="flex flex-col w-full space-y-4">
        {tickets &&
          tickets.map((ticket: Tables<"tickets">) => (
            <AnalyticsCard
              ticket={ticket}
              sold={ticket.quantity ? Math.round(ticket.quantity * 0.6) : 0}
            />
          ))}
      </div>
    </main>
  );
}
