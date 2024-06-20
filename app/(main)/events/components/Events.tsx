import ListEvents from "./ListEvents";
import { validateUser } from "@/lib/actions/auth";
import { SearchParams } from "@/types/event";
import { getEventsDisplayData } from "@/lib/helpers/events";

export default async function Events({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const {
    data: { user },
  } = await validateUser();

  const events = await getEventsDisplayData(1, searchParams);

  return events && events.length > 0 ? (
    <ListEvents user={user} events={events} searchParams={searchParams} />
  ) : (
    <div>
      <p className="text-2xl text-muted-foreground">No events found</p>
    </div>
  );
}
