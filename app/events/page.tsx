import EventDisplay from "@/components/events/shared/EventDisplay";
import EventCard from "@/components/events/events-public/EventCard";
import TagFiltering from "@/components/events/events-page-client-components/TagFiltering";
import FilteringButtons from "@/components/events/events-page-client-components/FilteringButtons";
import {
  getAllEventData,
  getEventDataByDate,
  getEventDataByTag,
  getTagData,
  getDateTagEventData,
} from "@/utils/helpers/eventsFiltering";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    tag?: string;
    from?: string;
    until?: string;
    numEvents?: string;
    search?: string;
  };
}) {
  const tagQuery = searchParams?.tag || null;
  const fromQuery = searchParams?.from || null;
  const untilQuery = searchParams?.until || null;
  const search = searchParams?.search || null;

  let numEvents = 10;
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
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
