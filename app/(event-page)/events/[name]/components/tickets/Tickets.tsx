import { EventDisplayData } from "@/types/event";
import { EventWithDates } from "@/types/event";
import SeeTickets from "./SeeTickets";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Tickets({
  event,
  eventDisplayData,
}: {
  event: EventWithDates;
  eventDisplayData: EventDisplayData;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });
  const hasTickets = tickets && tickets.length > 0;

  return (
    hasTickets && (
      <SeeTickets tickets={tickets} eventDisplayData={eventDisplayData} />
    )
  );
}
