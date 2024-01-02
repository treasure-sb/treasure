import Link from "next/link";
import ListUserEvents from "./ListUserEvents";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { getUserEventsDisplayData } from "@/lib/helpers/events";

/**
 * UserEvents displays a list of events specific to the logged-in user based.
 * It fetches event data based on the selected filter (e.g., events they are attending, hosting, or have applied to).
 * If no events are found for the specified filter, it displays a corresponding message with an action button.
 *
 * @param {object} props - The properties passed to the component.
 * @param {User} props.user - The current logged-in user object from Supabase.
 * @param {object} [props.searchParams] - Optional search parameters to filter the events.
 * @param {string} [props.searchParams.filter] - The filter to apply to the events (e.g., 'Hosting', 'Applied').
 * @returns {JSX.Element} - A React component that renders either a list of user-specific events or a message indicating no events.
 */
export default async function UserEvents({
  user,
  searchParams,
}: {
  user: User;
  searchParams?: { filter?: string };
}) {
  const filter = searchParams?.filter || null;
  const events = await getUserEventsDisplayData(1, filter, user);

  return (
    <>
      {events.length === 0 ? (
        <div className="flex flex-col space-y-4">
          {!filter && (
            <>
              <div className="text-center mt-10">
                You are currently attending no events
              </div>
              <Link href="/events" className="m-auto">
                <Button className="w-40">Browse Events</Button>
              </Link>
            </>
          )}
          {filter === "Applied" && (
            <>
              <div className="text-center mt-10">
                You have not applied to any events
              </div>
              <Link href="/events" className="m-auto">
                <Button className="w-40">Browse Events</Button>
              </Link>
            </>
          )}
          {filter === "Liked" && (
            <>
              <div className="text-center mt-10">
                You currently have no likes
              </div>
              <Link href="/events" className="m-auto">
                <Button className="w-40">Browse Events</Button>
              </Link>
            </>
          )}
          {filter === "Hosting" && (
            <>
              <div className="text-center mt-10">
                You are currently hosting no events
              </div>
              <Link href="/profile/create-event" className="m-auto">
                <Button className="w-40">Create Event</Button>
              </Link>
            </>
          )}
        </div>
      ) : (
        <ListUserEvents user={user} events={events} filter={filter} />
      )}
    </>
  );
}
