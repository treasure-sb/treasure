import {
  getAllEventData,
  getEventDataByDate,
  getEventDataByTag,
  getTagData,
  getDateTagEventData,
} from "@/lib/helpers/eventsFiltering";
import MainDisplay from "@/components/events/displays/MainDisplay";
import EventCard from "@/components/events/cards/EventCard";
import ListEvents from "@/components/events/shared/ListEvents";
import NotFound from "@/components/icons/NotFound";

export default async function ListMainEvents({
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
        <ListEvents
          events={events}
          DisplayComponent={MainDisplay}
          CardComponent={EventCard}
        />
      ) : (
        <div>
          <h1 className="text-center">No Events</h1>
        </div>
      )}
    </>
  );
}
