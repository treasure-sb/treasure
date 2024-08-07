import { Tables } from "@/types/supabase";
import { EventWithDates } from "@/types/event";
import { eventDisplayData } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventCard from "@/components/events/shared/EventCard";

type TempEventData = EventWithDates & {
  temporary_hosts: { host_id: string }[];
};

export default async function ListEventsHosting({
  user,
}: {
  user: Tables<"temporary_profiles">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select(
      "*, dates:event_dates(date, start_time, end_time), temporary_hosts!inner(event_id)"
    )
    .eq("temporary_hosts.host_id", user.id);

  const tempEvents: TempEventData[] = eventData || [];
  const events: EventWithDates[] = tempEvents.map((event) => {
    const { temporary_hosts, ...rest } = event;
    return {
      ...rest,
    };
  });
  const eventDisplay = await eventDisplayData(events);

  return (
    <>
      <p className="mb-6 font-semibold">
        Upcoming events {user.business_name} is hosting
      </p>
      <div className="md:hidden block space-y-4 relative">
        {eventDisplay.map((event) => (
          <EventCard
            showLikeButton={false}
            key={event.id + "card"}
            event={event}
            redirectTo={`/events/${event.cleaned_name}`}
          />
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
        {eventDisplay.map((event) => (
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
