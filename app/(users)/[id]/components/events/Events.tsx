import { getUserEventsDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import ListEvents from "./ListEvents";
import { User } from "@supabase/supabase-js";

export default async function Events({
  eventsFilter,
  user,
  loggedInUser,
}: {
  eventsFilter: string;
  user: Tables<"profiles">;
  loggedInUser: User | null;
}) {
  const events = await getUserEventsDisplayData(1, eventsFilter, user);

  return events && events.length > 0 ? (
    <ListEvents
      events={events}
      user={user}
      loggedInUser={loggedInUser}
      eventFilter={eventsFilter}
    />
  ) : (
    <div>No Events</div>
  );
}
