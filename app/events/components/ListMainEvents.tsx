import {
  getAllEventData,
  getEventDataByDate,
  getEventDataByTag,
  getTagData,
  getDateTagEventData,
} from "@/lib/helpers/eventsFiltering";
import { getPublicPosterUrl, formatDate } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import ClientListEvents from "./ClientListEvents";

export default async function ListMainEvents({
  searchParams,
}: {
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
    const tagQuery = searchParams?.tag || null;
    const fromQuery = searchParams?.from || null;
    const untilQuery = searchParams?.until || null;
    const search = searchParams?.search || null;
    if (fromQuery && untilQuery && tagQuery) {
      const { data: tagData, error: tagError } = await getTagData(tagQuery);
      const { data: dateTagEventData, error: dateTagEventError } =
        await getDateTagEventData(
          search || "",
          tagData?.id,
          fromQuery,
          untilQuery,
          page
        );
      events = dateTagEventData || [];
    } else if (fromQuery && untilQuery) {
      const { data: dateEventData, error: dateEventError } =
        await getEventDataByDate(search || "", fromQuery, untilQuery, page);
      events = dateEventData || [];
    } else if (tagQuery) {
      const { data: tagData, error: tagError } = await getTagData(tagQuery);
      const { data: eventData, error: eventError } = await getEventDataByTag(
        search || "",
        tagData?.id,
        page
      );
      events = eventData || [];
    } else {
      const { data: allEventData, error: allEventError } =
        await getAllEventData(search || "", page);
      events = allEventData || [];
    }
    return events;
  };

  const fetchEventsData = async (page: number) => {
    "use server";
    const supabase = await createSupabaseServerClient();
    const events: any = await fetchEvents(page);
    const eventsWithDetails = await Promise.all(
      events.map(async (event: any) => {
        const ticketsPromise = supabase
          .from("tickets")
          .select("*")
          .eq("event_id", event.id);

        const publicPosterUrlPromise = getPublicPosterUrl(event);

        const [ticketsResponse, publicPosterUrl] = await Promise.all([
          ticketsPromise,
          publicPosterUrlPromise,
        ]);

        return {
          ...event,
          tickets: ticketsResponse.data,
          publicPosterUrl,
          formattedDate: formatDate(event.date),
        };
      })
    );
    return eventsWithDetails;
  };

  const events = await fetchEventsData(1);

  return (
    <>
      {events && events.length > 0 ? (
        <ClientListEvents
          events={events}
          fetchData={fetchEventsData}
          searchParams={searchParams}
        />
      ) : (
        <div>
          <h1 className="text-center">No Events</h1>
        </div>
      )}
    </>
  );
}
