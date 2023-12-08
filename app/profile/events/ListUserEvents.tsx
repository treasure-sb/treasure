import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import EventCard from "@/components/events/cards/EventCard";
import HostingCard from "@/components/events/cards/HostingCard";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import AttendingDisplay from "@/components/events/displays/AttendingDisplay";
import HostingDisplay from "@/components/events/displays/HostingDisplay";
import ListEvents from "@/components/events/shared/ListEvents";

export default async function ListUserEvents({
  user,
  searchParams,
}: {
  user: User;
  searchParams?: { filter?: string };
}) {
  const filter = searchParams?.filter || null;
  const supabase = await createSupabaseServerClient();
  let events: any[] = [];
  let DisplayComponent: React.FC<{ event: Tables<"events"> }> =
    AttendingDisplay;
  let CardDisplay: React.FC<{ event: Tables<"events">; redirectTo: string }> =
    EventCard;

  if (filter === "Hosting") {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id);
    if (eventData) {
      events = eventData;
    }
    DisplayComponent = HostingDisplay;
    CardDisplay = HostingCard;
  } else if (filter === "Applied") {
    const { data: appliedEventsData, error: appliedEventsError } =
      await supabase
        .from("vendor_applications")
        .select("events(*)")
        .eq("vendor_id", user.id);

    const appliedEvents = appliedEventsData?.map((event) => event.events);
    if (appliedEvents) {
      events = appliedEvents;
    }
  }

  return (
    <>
      {events.length === 0 ? (
        <div className="flex flex-col space-y-4">
          {!filter && (
            <>
              <div className="text-center mt-10">
                You are currently attending no events
              </div>
              <Link href="/events" className="m-auto">
                <Button className="w-40">Browse Events</Button>
              </Link>
            </>
          )}
          {filter === "Hosting" && (
            <>
              <div className="text-center mt-10">
                You are currently hosting no events
              </div>
              <Link href="/events/create" className="m-auto">
                <Button className="w-40">Create Event</Button>
              </Link>
            </>
          )}
          {filter === "Applied" && (
            <>
              <div className="text-center mt-10">
                You have not applied to any events
              </div>
              <Link href="/events" className="m-auto">
                <Button className="w-40">Search Events</Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <ListEvents
          events={events}
          DisplayComponent={DisplayComponent}
          CardComponent={CardDisplay}
        />
      )}
    </>
  );
}
