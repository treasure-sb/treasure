import createSupabaseServerClient from "@/utils/supabase/server";
import EventImage from "@/components/events/shared/EventImage";
import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import { getEventFromId } from "@/lib/helpers/events";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    ticket_id: string;
    event_id: string;
  };
}) {
  const { ticket_id, event_id } = searchParams;
  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromId(event_id);

  const { data: eventTicketData, error: eventTicketError } = await supabase
    .from("event_tickets")
    .select("*, tickets(name)")
    .eq("id", ticket_id)
    .single();

  if (!eventTicketData || eventTicketError) {
    redirect("/");
  }

  const eventTicket = eventTicketData || {};
  const valid = eventTicket.valid;

  const { data: attendeeData } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", eventTicket.attendee_id)
    .single();

  const attendee: Partial<Tables<"profiles">> = attendeeData || {};

  await supabase
    .from("event_tickets")
    .update({ valid: false })
    .eq("id", eventTicket.id);

  return (
    <main className="max-w-xl m-auto">
      <EventImage event={event} />
      {valid ? (
        <>
          <h1 className="text-2xl mt-2 text-primary font-bold">{`${attendee.first_name} ${attendee.last_name} has checked in!`}</h1>
          <p className="text-tertiary font-bold text-xl">
            Ticket Type: {eventTicket.tickets.name}
          </p>
        </>
      ) : (
        <h1 className="text-2xl mt-2 text-destructive font-bold">
          This ticket has already been used.
        </h1>
      )}
      <p className="text-sm">Ticket ID: {eventTicket.id}</p>
    </main>
  );
}
