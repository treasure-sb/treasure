import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/cards/EventCard";
import MainDisplay from "@/components/events/displays/MainDisplay";
import format from "date-fns/format";
import { Tables } from "@/types/supabase";

export default async function ListProfileEvents({
  filter,
  user,
}: {
  filter: string;
  user: Tables<"profiles">;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const supabase = await createSupabaseServerClient();
  let events: Tables<"events">[] = [];

  if (filter === "Hosting") {
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("organizer_id", user.id)
      .gte("date", today)
      .order("date", { ascending: false });
    events = eventsData || [];
  } else if (filter === "Vending") {
    const { data: eventsData, error: eventsError } = await supabase
      .from("event_vendors")
      .select("*, events(*)")
      .eq("vendor_id", user.id)
      .gte("date", today)
      .order("date", { ascending: false, foreignTable: "events" });
    const eventsUnjoined = eventsData?.map((event) => event.events);
    events = eventsUnjoined || [];
  }

  return (
    <>
      {filter === "Hosting" ? (
        events.length === 0 ? (
          <p className="text-center my-6 font-semibold">
            No upcoming events hosted by {user.first_name}
          </p>
        ) : (
          <p className="my-6 font-semibold">
            Upcoming Events Hosted by {user.first_name}
          </p>
        )
      ) : filter === "Vending" ? (
        events.length === 0 ? (
          <p className="text-center my-6 font-semibold">
            No upcoming events {user.first_name} is vending at
          </p>
        ) : (
          <p className="my-6 font-semibold">
            Upcoming Events {user.first_name} is Vending At
          </p>
        )
      ) : null}

      <div className="md:hidden block space-y-6">
        {events.map((event) => (
          <EventCard
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <MainDisplay event={event} />
        ))}
      </div>
    </>
  );
}
