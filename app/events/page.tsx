import { Button } from "@/components/ui/button";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/events-public/EventCard";
import TagFiltering from "@/components/events/client-components/TagFiltering";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const supabase = await createSupabaseServerClient();
  let { data: events, error } = await supabase.from("events").select("*");

  if (query) {
    const { data: tagIds, error: tagIdsError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", query);

    const tagIdArray = tagIds?.map((tag) => tag.id) || [];
    const { data: eventIds, error: eventIdsError } = await supabase
      .from("event_tags")
      .select("event_id")
      .in("tag_id", tagIdArray);

    const eventIdArray = eventIds?.map((event) => event.event_id) || [];
    let { data, error } = await supabase
      .from("events")
      .select("*")
      .in("id", eventIdArray);
    events = data;
  }

  return (
    <main className="max-w-xl m-auto">
      <div className="flex space-x-2 mb-2">
        <Button>New York, NY</Button>
        <Button>Date</Button>
      </div>
      <TagFiltering />
      <div className="my-4">
        {query ? (
          <h1 className="font-semibold text-2xl">Popular {query} Events</h1>
        ) : (
          <h1 className="font-semibold text-2xl">Popular Events</h1>
        )}
        <h1 className="font-bold text-gray-500">In New York, NY</h1>
      </div>
      {events && events.length > 0 ? (
        <div className="space-y-8">
          <Suspense
            fallback={
              <div className="h-40 bg-white rounded-full">Loading...</div>
            }
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
        </div>
      ) : (
        <div>No Events</div>
      )}
    </main>
  );
}
