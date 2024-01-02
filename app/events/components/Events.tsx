import ListEvents from "./ListEvents";
import { validateUser } from "@/lib/actions/auth";
import { SearchParams } from "@/types/event";
import { getEventsDisplayData } from "@/lib/helpers/events";

/**
 * Renders a list of events based on provided search parameters.
 * If events are found, it displays them using the ListEvents component.
 * If no events are found, it shows a message indicating that there are no events.
 * Initially, it fetches the first page of events using the `getEventsDisplayData` helper function.
 *
 * @param {Object} props - The component props.
 * @param {SearchParams} props.searchParams - Optional search parameters to filter the events.
 * @returns {React.Component} - A React component displaying either a list of events or a message indicating no events.
 */
export default async function Events({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const {
    data: { user },
  } = await validateUser();

  const events = await getEventsDisplayData(1, searchParams);

  return (
    <>
      {events && events.length > 0 ? (
        <ListEvents user={user} events={events} searchParams={searchParams} />
      ) : (
        <div>
          <h1 className="text-center">No Events</h1>
        </div>
      )}
    </>
  );
}
