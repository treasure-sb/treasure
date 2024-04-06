import createSupabaseServerClient from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import EventImage from "@/components/events/shared/EventImage";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    ticket_id: string;
    event_id: string;
  };
}) {
  const { ticket_id, event_id } = searchParams;
  const {
    data: { user },
  } = await validateUser();
  const supabase = await createSupabaseServerClient();

  if (!user) {
    redirect("/login");
  }

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  if (eventData.organizer_id == user.id || user.role == "admin") {
    redirect("/");
  }

  const { data: eventTicketData, error: eventTicketError } = await supabase
    .from("event_tickets")
    .select("*, tickets(name)")
    .eq("id", ticket_id)
    .single();

  if (!eventTicketData || eventTicketError) {
    redirect("/");
  }

  const event: Tables<"events"> = eventData || {};
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
          <h2 className="text-tertiary font-bold text-xl">
            Ticket Type: {eventTicket.tickets.name}
          </h2>
        </>
      ) : (
        <h1 className="text-2xl mt-2 text-destructive">
          This ticket has already been used.
        </h1>
      )}
      <h1 className="text-sm">Ticket ID: {eventTicket.id}</h1>
    </main>
  );
}
