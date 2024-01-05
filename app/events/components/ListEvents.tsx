"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { getEventsDisplayData } from "@/lib/helpers/events";
import { EventDisplayData, SearchParams } from "@/types/event";
import { Button } from "@/components/ui/button";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import EventCard from "@/components/events/shared/EventCard";
import EventDisplay from "@/components/events/shared/EventDisplay";

/**
 * List events with infinite scrolling functionality on mobile and standard pagination on desktop.
 * It fetches event data based on the provided search parameters.
 * The component handles both the initial data load and subsequent data fetching when the user scrolls down.
 *
 * @param {Object} props - The component props.
 * @param {EventDisplayData[]} props.events - Initial event data loaded on the server side.
 * @param {User | null} [props.user] - Optional user information for user-specific data handling.
 * @param {SearchParams} [props.searchParams] - Optional search parameters for filtering events.
 * @returns {React.Component} - A component that displays a list of events and handles infinite scrolling.
 */
export default function ListEvents({
  events,
  user,
  searchParams,
}: {
  events: EventDisplayData[];
  user?: User | null;
  searchParams?: SearchParams;
}) {
  const serializedParams = JSON.stringify(searchParams);
  const [fetchingPage, setFetchingPage] = useState(false);
  const { data, fetchNextPage, isLoading } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["events", serializedParams],
    queryFn: async ({ pageParam = 1 }) =>
      await getEventsDisplayData(pageParam, searchParams),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage && lastPage.length < 6) return undefined;
      return pages.length + 1;
    },
    initialData: { pages: [events], pageParams: [1] },
  });

  const allEvents = data?.pages.flat();
  const lastEventRef = useRef<HTMLElement>(null);
  const lastEventRefDesktop = useRef<HTMLElement>(null);

  const { ref, entry } = useIntersection({
    root: lastEventRef.current,
    threshold: 1,
  });

  const { ref: desktopRef, entry: desktopEntry } = useIntersection({
    root: lastEventRefDesktop.current,
    threshold: 1,
  });

  useEffect(() => {
    const fetchPage = async () => {
      if (entry?.isIntersecting || desktopEntry?.isIntersecting) {
        setFetchingPage(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchNextPage();
        setFetchingPage(false);
      }
    };
    fetchPage();
  }, [entry, desktopEntry]);

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
              redirectTo={`/events/${event.cleaned_name}`}
              event={event}
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
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
          {allEvents?.map((event, i) => (
            <div
              className="hover:translate-y-[-.75rem] transition duration-500"
              ref={allEvents.length - 1 === i + 1 ? desktopRef : null}
              key={event.id + "display"}
            >
              <EventDisplay event={event} />
            </div>
          ))}
        </div>
        {fetchingPage && (
          <div className="flex flex-row items-center justify-center mt-16">
            <TreasureEmerald bounce={true} width={36} height={36} delay={0} />
            <TreasureEmerald bounce={true} width={36} height={36} delay={0.1} />
            <TreasureEmerald bounce={true} width={36} height={36} delay={0.2} />
          </div>
        )}
      </div>
    </>
  );
}
