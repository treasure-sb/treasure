"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ClientMainDisplay from "./ClientMainDisplay";

export default function ClientListEvents({
  events,
  fetchData,
}: {
  events: any[];
  fetchData: (page: number) => Promise<any[]>;
}) {
  const [loadedEvents, setLoadedEvents] = useState(new Set());
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["events"],
      queryFn: async ({ pageParam = 1 }) => await fetchData(pageParam),
      getNextPageParam: (_, pages) => pages.length + 1,
      initialData: { pages: [events], pageParams: [1] },
    });

  const handleImageLoad = (eventId: string) => {
    setLoadedEvents((prevLoadedEvents) =>
      new Set(prevLoadedEvents).add(eventId)
    );
  };

  const allEvents = data?.pages.flat();

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allEvents?.map((event: any) => (
          <div key={event.id}>
            <ClientMainDisplay event={event} onImageLoad={handleImageLoad} />
          </div>
        ))}
      </div>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load more
        </button>
      )}
    </div>
  );
}
