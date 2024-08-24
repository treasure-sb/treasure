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
    .select("*, tickets(name), event_tickets_dates(*, event_dates(date))")
    .eq("id", ticket_id)
    .single();

  if (!eventTicketData || eventTicketError) {
    redirect("/");
  }

  const eventTicket = eventTicketData || {};
  const today = new Date();
  const formattedToday =
    String(today.getFullYear()) +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  let valid = 0;
  let event_tickets_datesID;
  eventTicket.event_tickets_dates.map((date: any) => {
    if (date.event_dates.date === formattedToday && date.valid === true) {
      valid = 1;
      event_tickets_datesID = date.id;
    } else if (
      date.event_dates.date === formattedToday &&
      date.valid === false
    ) {
      valid = 2;
    }
  });

  const { data: attendeeData } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", eventTicket.attendee_id)
    .single();

  const attendee: Partial<Tables<"profiles">> = attendeeData || {};

  if (valid === 1) {
    const { data, error } = await supabase
      .from("event_tickets_dates")
      .update({ valid: false, checked_in_at: new Date().toISOString() })
      .eq("id", event_tickets_datesID);
  }

  return (
    <main className="max-w-xl m-auto">
      <EventImage event={event} />
      {valid === 1 ? (
        <>
          <h1 className="text-2xl mt-2 text-primary font-bold">{`${attendee.first_name} ${attendee.last_name} has checked in!`}</h1>
          <p className="text-tertiary font-bold text-xl">
            Ticket Type: {eventTicket.tickets.name}
          </p>
        </>
      ) : valid === 2 ? (
        <h1 className="text-2xl mt-2 text-destructive font-bold">
          This ticket has already been used.
        </h1>
      ) : (
        <h1 className="text-2xl mt-2 text-destructive font-bold">
          This ticket is not valid today.
        </h1>
      )}
      <p className="text-sm">Ticket ID: {eventTicket.id}</p>
    </main>
  );
}
