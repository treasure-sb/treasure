"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useState } from "react";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import ArrowPointingDown from "@/components/icons/ArrowPointingDown";
import ClientCardDisplay from "./ClientCardDisplay";
import ClientMainDisplay from "./ClientMainDisplay";

export default function ClientListEvents({
  events,
  fetchData,
  searchParams,
}: {
  events: any[];
  fetchData: (page: number) => Promise<any[]>;
  searchParams?: {
    tag?: string;
    from?: string;
    until?: string;
    search?: string;
  };
}) {
  const queryClient = useQueryClient();
  const serializedParams = JSON.stringify(searchParams);
  const [fetchingPage, setFetchingPage] = useState(false);
  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["events", serializedParams],
    queryFn: async ({ pageParam = 1 }) => await fetchData(pageParam),
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

  useEffect(() => {
    refetch();
  }, [serializedParams, refetch]);

  return (
    <div>
      <>
        <div className="space-y-8 md:hidden block">
          <ClientMainDisplay event={events[0]} />
          {allEvents?.slice(1).map((event, i) => (
            <div
              key={event.id + "card"}
              ref={allEvents.length - 1 === i + 1 ? ref : null}
            >
              <ClientCardDisplay
                redirectTo={`/events/${event.cleaned_name}`}
                event={event}
              />
            </div>
          ))}
          {fetchingPage && (
            <div className="flex flex-row items-center justify-center">
              <TreasureEmerald bounce={true} width={24} height={24} delay={0} />
              <TreasureEmerald
                bounce={true}
                width={24}
                height={24}
                delay={0.1}
              />
              <TreasureEmerald
                bounce={true}
                width={24}
                height={24}
                delay={0.2}
              />
            </div>
          )}
        </div>
        <div className="md:flex flex-col hidden">
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allEvents?.map((event, i) => (
              <div key={event.id + "display"}>
                <ClientMainDisplay event={event} />
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
    </div>
  );
}
