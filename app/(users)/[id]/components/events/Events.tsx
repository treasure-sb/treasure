import { getUserEventsDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import ListUpcomingEvents from "./ListUpcomingEvents";
import ListPreviousEvents from "./ListPastEvents";
import EventFilters from "../filtering/EventFilters";

export default async function Events({
  eventsFilter,
  user,
  loggedInUser,
  isHosting,
}: {
  eventsFilter: string;
  user: Tables<"profiles">;
  loggedInUser: User | null;
  isHosting: boolean;
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
  return (
    <div>
      <EventFilters isHosting={isHosting} />
      <Separator className="md:hidden block my-6 mt-2" />
      {upcomingEvents.length > 0 || pastEvents.length > 0 ? (
        <div className="space-y-10 md:mt-10">
          {upcomingEvents.length > 0 && (
            <ListUpcomingEvents
              events={upcomingEvents}
              user={user}
              loggedInUser={loggedInUser}
              eventFilter={eventsFilter}
            />
          )}
          {pastEvents.length > 0 && (
            <ListPreviousEvents
              events={pastEvents}
              user={user}
              loggedInUser={loggedInUser}
              eventFilter={eventsFilter}
            />
          )}
        </div>
      ) : (
        <h1 className="mt-6">No events {eventsFilter}</h1>
      )}
    </div>
  );
}
