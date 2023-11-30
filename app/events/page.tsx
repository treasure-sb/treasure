import { Button } from "@/components/ui/button";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/events-public/EventCard";
import TagFiltering from "@/components/events/events-page-client-components/TagFiltering";
import DateFiltering from "@/components/events/events-page-client-components/DateFiltering";
import SeeMore from "@/components/events/events-page-client-components/SeeMore";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  let numEvents = 4;
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
  const isSeeMoreVisible = events.length >= numEvents + 1;
  return (
    <main className="max-w-xl m-auto">
      <div className="flex space-x-2 mb-2">
        <Button>New York, NY</Button>
        <DateFiltering />
      </div>
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
        <div className="space-y-8">
          <Suspense
            fallback={<Skeleton className="w-full h-[500px] rounded-md" />}
          >
            <EventDisplay event={events[0]} />
          </Suspense>
          {events.splice(1).map((event) => (
            <EventCard
              redirectTo={`/events/${event.id}`}
              key={event.id}
              event={event}
            />
          ))}
          {isSeeMoreVisible && <SeeMore />}
        </div>
      ) : (
        <div>No Events</div>
      )}
    </main>
  );
}
