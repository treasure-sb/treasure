import Link from "next/link";
import EventImage from "../shared/EventImage";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";

export default async function EventDisplay({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const formattedDate = formatDate(event.date);
  const { data: tickets, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  return (
    <div className="group aspect-square w-full">
      <Link href={`/events/${event.id}`}>
        <EventImage event={event} />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-primary">{formattedDate}</span>{" "}
          {event.venue_name}
        </h1>
        <div>
          {tickets?.map((ticket) => (
            <h1 key={ticket.id}>
              ${ticket.price} {ticket.name}
            </h1>
          ))}
        </div>
      </Link>
    </div>
  );
}
