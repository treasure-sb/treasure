import { eventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { DraftEventWithDates, EventWithDates } from "@/types/event";
import createSupabaseServerClient from "@/utils/supabase/server";
import NextEventCard from "./NextEventCard";
import RegularEventCard from "./RegularEventCard";
import DraftEventCard from "./DraftEventCard";

type MyLiveEvent = {
  role: string;
  event: EventWithDates;
};

type MyDraftEvent = {
  role: string;
  event: DraftEventWithDates;
};

export default async function AllEvents() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date();

  const { data: upcomingData } = await supabase
    .from("event_roles")
    .select(
      "role, event:events!inner(*, dates:event_dates!inner(date, start_time, end_time))"
    )
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .eq("event.status", "LIVE")
    .gte("event.max_date", today.toISOString())
    .order("event(min_date)", { ascending: true })
    .returns<MyLiveEvent[]>();

  const { data: pastData } = await supabase
    .from("event_roles")
    .select(
      "role, event:events!inner(*, dates:event_dates!inner(date, start_time, end_time))"
    )
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .eq("event.status", "LIVE")
    .lt("event.max_date", today.toISOString())
    .order("event(min_date)", { ascending: false })
    .returns<MyLiveEvent[]>();

  const { data: draftEvents } = await supabase
    .from("event_roles")
    .select(
      "role, event:events(*, dates:event_dates(date, start_time, end_time))"
    )
    .eq("user_id", user.id)
    .eq("event.status", "DRAFT")
    .returns<MyDraftEvent[]>();

  const upcomingEventsHosting = upcomingData
    ? upcomingData.map((event) => event.event)
    : [];
  const pastEventsHosting = pastData
    ? pastData.map((event) => event.event)
    : [];

  const draftEventsHosting = draftEvents
    ? draftEvents.map((event) => event.event)
    : [];

  const upcomingEventData = await eventDisplayData(upcomingEventsHosting);
  const pastEventData = await eventDisplayData(pastEventsHosting);
  const draftEventData = await eventDisplayData(draftEventsHosting);
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
      <div className="space-y-2">
        <h2 className="text-xl">Draft Events</h2>
        {draftEventsHosting.length === 0 ? (
          <p className="text-xl text-muted-foreground">No past events</p>
        ) : (
          <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 2xl:grid-cols-3">
            {draftEventData.map((event) => (
              <DraftEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
