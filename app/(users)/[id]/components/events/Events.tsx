import { getUserEventsDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import ListUpcomingEvents from "./ListUpcomingEvents";
import ListPreviousEvents from "./ListPastEvents";

export default async function Events({
  eventsFilter,
  user,
  loggedInUser,
}: {
  eventsFilter: string;
  user: Tables<"profiles">;
  loggedInUser: User | null;
}) {
  const upcomingEvents = await getUserEventsDisplayData(
    1,
    eventsFilter,
    true,
    user
  );
  const pastEvents = await getUserEventsDisplayData(
    1,
    eventsFilter,
    false,
    user
  );

  return upcomingEvents && upcomingEvents.length > 0 ? (
    <div className="space-y-10 md:mt-10">
      {upcomingEvents && upcomingEvents.length > 0 && (
        <ListUpcomingEvents
          events={upcomingEvents}
          user={user}
          loggedInUser={loggedInUser}
          eventFilter={eventsFilter}
        />
      )}
      {pastEvents && pastEvents.length > 0 && (
        <ListPreviousEvents
          events={pastEvents}
          user={user}
          loggedInUser={loggedInUser}
          eventFilter={eventsFilter}
        />
      )}
    </div>
  ) : (
    <div className="md:mt-10">No Events {eventsFilter}</div>
  );
}
