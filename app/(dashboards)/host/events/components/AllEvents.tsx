import { eventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { EventWithDates } from "@/types/event";
import createSupabaseServerClient from "@/utils/supabase/server";
import NextEventCard from "./NextEventCard";
import RegularEventCard from "./RegularEventCard";

export default async function AllEvents() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const today = new Date();

  const { data: upcomingData, error: upcomingError } = await supabase
    .from("events")
    .select("*, dates:event_dates!inner(date, start_time, end_time)")
    .eq("organizer_id", user?.id as string)
    .gte("max_date", today.toISOString())
    .order("min_date", { ascending: true });

  const { data: pastData, error: pastError } = await supabase
    .from("events")
    .select("*, dates:event_dates!inner(date, start_time, end_time)")
    .eq("organizer_id", user?.id as string)
    .lt("max_date", today.toISOString())
    .order("min_date", { ascending: false });

  if (!upcomingData || upcomingError) {
    redirect("/events");
  }

  const upcomingEventsHosting: EventWithDates[] = upcomingData || [];
  const pastEventsHosting: EventWithDates[] = pastData || [];

  const upcomingEventData = await eventDisplayData(upcomingEventsHosting);
  const pastEventData = await eventDisplayData(pastEventsHosting);

  const nextEvent = upcomingEventData.length > 0 ? upcomingEventData[0] : null;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl">Next Event</h2>
        {nextEvent === null ? (
          <p className="text-xl text-muted-foreground">No upcoming event</p>
        ) : (
          <NextEventCard
            event={nextEvent}
            redirectTo={`/host/events/${nextEvent.cleaned_name}`}
          />
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl">Upcoming Events</h2>
        {upcomingEventData.length === 0 ? (
          <p className="text-xl text-muted-foreground">No upcoming events</p>
        ) : (
          <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 2xl:grid-cols-3">
            {upcomingEventData.map((event) => (
              <RegularEventCard
                event={event}
                key={event.id}
                redirectTo={`/host/events/${event.cleaned_name}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl">Past Events</h2>
        {pastEventData.length === 0 ? (
          <p className="text-xl text-muted-foreground">No past events</p>
        ) : (
          <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 2xl:grid-cols-3">
            {pastEventData.map((event) => (
              <RegularEventCard
                event={event}
                key={event.id}
                redirectTo={`/host/events/${event.cleaned_name}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
