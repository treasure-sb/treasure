"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEventsDisplayData } from "@/lib/helpers/events";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import ArrowPointingDown from "@/components/icons/ArrowPointingDown";
import EventCard from "@/components/events/shared/EventCard";
import EventDisplay from "@/components/events/shared/EventDisplay";

export default function ListPastEvents({
  events,
  user,
  loggedInUser,
  eventFilter,
}: {
  events: EventDisplayData[];
  loggedInUser: User | null;
  user: Tables<"profiles"> | Tables<"temporary_profiles">;
  eventFilter: string;
}) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["user-events-past", eventFilter, user.id],
    queryFn: async ({ pageParam }) =>
      await getUserEventsDisplayData(pageParam, eventFilter, false, user),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length < 6) return undefined;
      return pages.length + 1;
    },
    initialData: { pages: [events], pageParams: [1] },
  });

  const allEvents = data?.pages.flat();

  return (
    <div>
      <h1 className="font-semibold mb-4">Past Events {eventFilter}</h1>
      <div className="space-y-8 md:hidden block">
        {allEvents.map((event) => (
          <div key={event.id + "card"}>
            <EventCard
              redirectTo={`/events/${event.cleaned_name}`}
              event={event}
              user={loggedInUser}
            />
          </div>
        ))}
        {hasNextPage && (
          <ArrowPointingDown
            onClick={fetchNextPage}
            className="hover:translate-y-1 hover:cursor-pointer transition duration-300 m-auto"
          />
        )}
      </div>
      <div className="md:flex md:flex-col hidden">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allEvents?.map((event) => (
            <div
              className="hover:translate-y-[-.75rem] transition duration-500"
              key={event.id + "display"}
            >
              <EventDisplay event={event} user={loggedInUser} />
            </div>
          ))}
        </div>
        {hasNextPage && (
          <ArrowPointingDown
            onClick={fetchNextPage}
            className="hover:translate-y-1 hover:cursor-pointer transition duration-300 m-auto"
          />
        )}
      </div>
    </div>
  );
}
