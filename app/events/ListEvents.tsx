import {
  getAllEventData,
  getEventDataByDate,
  getEventDataByTag,
  getTagData,
  getDateTagEventData,
} from "@/lib/helpers/eventsFiltering";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventCard from "@/components/events/events-public/EventCard";

export default async function ListEvents({
  numEvents,
  searchParams,
}: {
  numEvents: number;
  searchParams?: {
    tag?: string;
    from?: string;
    until?: string;
    search?: string;
  };
}) {
  const tagQuery = searchParams?.tag || null;
  const fromQuery = searchParams?.from || null;
  const untilQuery = searchParams?.until || null;
  const search = searchParams?.search || null;
  let events = [];

  if (fromQuery && untilQuery && tagQuery) {
    const { data: tagData, error: tagError } = await getTagData(tagQuery);
    const { data: dateTagEventData, error: dateTagEventError } =
      await getDateTagEventData(
        search || "",
        tagData?.id,
        fromQuery,
        untilQuery,
        numEvents
      );
    events = dateTagEventData || [];
  } else if (fromQuery && untilQuery) {
    const { data: dateEventData, error: dateEventError } =
      await getEventDataByDate(search || "", fromQuery, untilQuery, numEvents);
    events = dateEventData || [];
  } else if (tagQuery) {
    const { data: tagData, error: tagError } = await getTagData(tagQuery);
    const { data: eventData, error: eventError } = await getEventDataByTag(
      search || "",
      tagData?.id,
      numEvents
    );
    events = eventData || [];
  } else {
    const { data: allEventData, error: allEventError } = await getAllEventData(
      search || "",
      numEvents
    );
    events = allEventData || [];
  }

  return (
    <>
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
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventDisplay key={`desktop-${event.id}`} event={event} />
            ))}
          </div>
        </>
      ) : (
        <div>No Events</div>
      )}
    </>
  );
}
