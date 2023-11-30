import { Button } from "@/components/ui/button";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/events-public/EventCard";
import TagFiltering from "@/components/events/events-page-client-components/TagFiltering";
import FilteringButtons from "@/components/events/events-page-client-components/FilteringButtons";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    tag?: string;
    from?: string;
    until?: string;
    numEvents?: string;
  };
}) {
  const tagQuery = searchParams?.tag || null;
  const fromQuery = searchParams?.from || null;
  const untilQuery = searchParams?.until || null;
  let numEvents = 10;
  if (searchParams?.numEvents) {
    numEvents = parseInt(searchParams.numEvents);
  }
  const supabase = await createSupabaseServerClient();
  let events = [];

  // works for now but have to go back to supabase and fix event_tags table to make this more efficient/simpler
  if (fromQuery && untilQuery && tagQuery) {
    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagQuery)
      .single();

    const { data: dateTagEventData, error: dateTagEventError } = await supabase
      .from("events")
      .select("*, event_tags!inner(*)")
      .range(0, numEvents)
      .gte("date", fromQuery)
      .lte("date", untilQuery)
      .eq("event_tags.tag_id", tagData?.id);

    if (dateTagEventData) {
      events = dateTagEventData;
    }
  } else if (fromQuery && untilQuery) {
    const { data: dateEventData, error: dateEventError } = await supabase
      .from("events")
      .select("*")
      .range(0, numEvents)
      .gte("date", fromQuery)
      .lte("date", untilQuery);
    if (dateEventData) {
      events = dateEventData;
    }
  } else if (tagQuery) {
    const { data: tagData, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tagQuery)
      .single();
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*, event_tags!inner(*)")
      .range(0, numEvents)
      .eq("event_tags.tag_id", tagData?.id);

    if (eventData) {
      events = eventData;
    }
  } else {
    const { data: allEventData, error: allEventError } = await supabase
      .from("events")
      .select("*")
      .range(0, numEvents);
    if (allEventData) {
      events = allEventData;
    }
  }

  return (
    <main className="max-w-lg md:max-w-5xl m-auto">
      <FilteringButtons />
      <TagFiltering />
      <div className="my-4">
        {tagQuery ? (
          <h1 className="font-semibold text-2xl">Popular {tagQuery} Events</h1>
        ) : (
          <h1 className="font-semibold text-2xl">Popular Events</h1>
        )}
        <h1 className="font-bold text-gray-500">In New York, NY</h1>
      </div>
      {events && events.length > 0 ? (
        <>
          <div className="space-y-8 md:hidden">
            <EventDisplay event={events[0]} />
            {events.slice(1).map((event) => (
              <EventCard
                redirectTo={`/events/${event.id}`}
                key={event.id}
                event={event}
              />
            ))}
          </div>
          <div className="hidden md:block">
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {events.map((event) => (
                <EventDisplay event={event} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>No Events</div>
      )}
    </main>
  );
}
