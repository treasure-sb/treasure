import { Tables } from "@/types/supabase";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventCard from "@/components/events/shared/EventCard";
import { getUserEventsDisplayData } from "@/lib/helpers/events";

export default async function ListEventsHosting({
  user,
}: {
  user: Tables<"temporary_profiles">;
}) {
  const events = await getUserEventsDisplayData(1, "Hosting", true, user);
  return (
    <>
      <p className="mb-6 font-semibold">
        Upcoming events {user.business_name} is hosting
      </p>
      <div className="md:hidden block space-y-4 relative">
        {events.map((event) => (
          <EventCard
            showLikeButton={false}
            key={event.id + "card"}
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
        {events.map((event) => (
          <EventDisplay
            showLikeButton={false}
            key={event.id + "display"}
            event={event}
          />
        ))}
      </div>
    </>
  );
}
