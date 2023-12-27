import {
  getAllEventData,
  getEventDataByDate,
  getEventDataByTag,
  getTagData,
  getDateTagEventData,
} from "@/lib/helpers/eventsFiltering";
import ClientListEvents from "./ClientListEvents";

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
  const fetchEvents = async (page: number) => {
    "use server";
    let events = [];
    const search = searchParams?.search || null;
    const { data: allEventData, error: allEventError } = await getAllEventData(
      search || "",
      page
    );
    events = allEventData || [];
    return events;
  };

  const events = await fetchEvents(1);

  return (
    <>
      {events && events.length > 0 ? (
        <ClientListEvents events={events} fetchData={fetchEvents} />
      ) : (
        <div>
          <h1 className="text-center">No Events</h1>
        </div>
      )}
    </>
  );
}
