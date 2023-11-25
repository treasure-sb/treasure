import { Button } from "@/components/ui/button";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/events-public/EventCard";

export default async function Events() {
  const supabase = await createSupabaseServerClient();
  const { data: events, error } = await supabase.from("events").select("*");

  return (
    <main className="max-w-xl md:max-w-6xl xl:max-w-7xl m-auto">
      <div className="flex space-x-2 mb-2">
        <Button>New York, NY</Button>
        <Button>Date</Button>
      </div>
      <div className="flex space-x-2 overflow-scroll scrollbar-hidden mb-2">
        <Button variant={"secondary"}>Pokemon</Button>
        <Button variant={"secondary"}>Sports</Button>
        <Button variant={"secondary"}>Anime</Button>
        <Button variant={"secondary"}>Trading Cards</Button>
        <Button variant={"secondary"}>Futbol</Button>
        <Button variant={"secondary"}>Jobs</Button>
      </div>
      <div className="my-4">
        <h1 className="font-semibold text-2xl">Popular Events</h1>
        <h1 className="font-bold text-gray-500">In New York, NY</h1>
      </div>
      {events ? (
        <div className="space-y-8">
          <EventDisplay event={events[0]} />
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
