import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/cards/EventCard";
import MainDisplay from "@/components/events/displays/MainDisplay";
import format from "date-fns/format";
import { Tables } from "@/types/supabase";

export default async function ListUserEvents({
  filter,
  user,
}: {
  filter: string;
  user: Tables<"profiles">;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const supabase = await createSupabaseServerClient();
  let eventsAttending: Tables<"events">[] = [];
  let eventsHosting: Tables<"events">[] = [];

  const { data: eventsHostingData, error: eventsHostingError } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("date", { ascending: false });
  eventsHosting = eventsHostingData || [];

  const { data: eventsVendingData, error: eventsVendingError } = await supabase
    .from("event_vendors")
    .select("*, events(*)")
    .eq("vendor_id", user.id)
    .order("date", { ascending: false, foreignTable: "events" });
  const eventsVendingUnjoined = eventsVendingData?.map((event) => event.events);
  eventsAttending = eventsVendingUnjoined || [];

  return (
    <>
      {filter === "Events" ? (
        eventsAttending.length === 0 && eventsHosting.length ? (
          <p className="text-center mb-6 font-semibold">
            No upcoming events {user.first_name} is attending
          </p>
        ) : (
          <p className="mb-6 font-semibold">
            Upcoming Events {user.first_name} is attending
          </p>
        )
      ) : null}

      <div className="md:hidden block space-y-6">
        {eventsAttending.map((event) => (
          <EventCard
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
        {eventsHosting.map((event) => (
          <EventCard
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsAttending.map((event) => (
          <MainDisplay event={event} />
        ))}
        {eventsHosting.map((event) => (
          <MainDisplay event={event} />
        ))}
      </div>
    </>
  );
}
