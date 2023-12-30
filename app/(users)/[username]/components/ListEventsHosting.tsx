import { Tables } from "@/types/supabase";
import EventCard from "@/components/events/cards/EventCard";
import MainDisplay from "@/components/events/displays/MainDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function ListEventsHosting({
  user,
}: {
  user: Tables<"temporary_profiles">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventsHostingData, error: eventsHostingError } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id);

  const eventsHosting: Tables<"events">[] = eventsHostingData || [];

  return (
    <>
      <p className="mb-6 font-semibold">
        Upcoming events {user.first_name} is hosting
      </p>
      <div className="md:hidden block space-y-4 relative">
        {eventsHosting.map((event) => (
          <EventCard
            key={event.id + "card"}
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
        {eventsHosting.map((event) => (
          <MainDisplay key={event.id + "display"} event={event} />
        ))}
      </div>
    </>
  );
}
