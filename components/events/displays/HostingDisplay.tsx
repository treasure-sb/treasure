import Link from "next/link";
import EventImage from "../shared/EventImage";
import { formatDate } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";

export default async function HostingDisplay({
  event,
}: {
  event: Tables<"events">;
}) {
  const formattedDate = formatDate(event.date);

  return (
    <div className="group aspect-square w-full">
      <Link href={`/profile/events/organizer/${event.id}`}>
        <EventImage event={event} />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-primary">{formattedDate}</span>{" "}
          {event.venue_name}
        </h1>
      </Link>
    </div>
  );
}
