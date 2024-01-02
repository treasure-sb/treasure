"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { getUserEventsDisplayData } from "@/lib/helpers/events";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import ArrowPointingDown from "@/components/icons/ArrowPointingDown";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventCard from "@/components/events/shared/EventCard";

/**
 * ListUserEvents manages the display of user-related events with an infinite scrolling mechanism on mobile
 * and standard pagination on desktop. It uses the `useInfiniteQuery` hook from `@tanstack/react-query` to fetch
 * data on the client.
 *
 * @param {EventDisplayData[]} events - The initial set of event data.
 * @param {User} user - The current user object.
 * @param {string | null} filter - A string representing the current filter applied to the event list, if any.
 * @returns {JSX.Element} - A React component rendering a list of events.
 */
export default function ListUserEvents({
  events,
  user,
  filter,
}: {
  events: EventDisplayData[];
  user: User;
  filter: string | null;
}) {
  const [fetchingPage, setFetchingPage] = useState(false);
  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["events", filter],
    queryFn: async ({ pageParam = 1 }) =>
      await getUserEventsDisplayData(pageParam, filter, user),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length < 6) return undefined;
      return pages.length + 1;
    },
    initialData: { pages: [events], pageParams: [1] },
  });

  const allEvents = data?.pages.flat();
  const lastEventRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastEventRef.current,
    threshold: 1,
  });

  useEffect(() => {
    const fetchPage = async () => {
      if (entry?.isIntersecting) {
        setFetchingPage(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchNextPage();
        setFetchingPage(false);
      }
    };
    fetchPage();
  }, [entry]);

  return (
    <>
      <div className="space-y-8 md:hidden block">
        <EventDisplay event={events[0]} />
        {allEvents?.slice(1).map((event, i) => (
          <div
            key={event.id + "card"}
            ref={allEvents.length - 1 === i + 1 ? ref : null}
          >
            <EventCard
              user={user}
              event={event}
              redirectTo={
                filter === "Hosting"
                  ? `/profile/events/organizer/${event.cleaned_name}`
                  : `/events/${event.cleaned_name}`
              }
              showLikeButton={filter === "Liked"}
            />
          </div>
        ))}
        {fetchingPage && (
          <div className="flex flex-row items-center justify-center">
            <TreasureEmerald bounce={true} width={24} height={24} delay={0} />
            <TreasureEmerald bounce={true} width={24} height={24} delay={0.1} />
            <TreasureEmerald bounce={true} width={24} height={24} delay={0.2} />
          </div>
        )}
      </div>
      <div className="md:flex flex-col hidden">
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allEvents?.map((event, i) => (
            <div key={event.id + "display"}>
              <EventDisplay event={event} />
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
    </>
  );
}
