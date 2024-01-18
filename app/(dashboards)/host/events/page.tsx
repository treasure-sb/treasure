"use client";

import { useEffect } from "react";
import { useStore } from "../store";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../query";
import { createClient } from "@/utils/supabase/client";
import { eventDisplayData } from "@/lib/helpers/events";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";

export default function Page() {
  const { setCurrentPage } = useStore();
  const user = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["events-hosting", user],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id);

      if (!data) return [];
      const eventData = eventDisplayData(data);
      return eventData;
    },
    enabled: !!user,
  });

  useEffect(() => {
    setCurrentPage("events");
  }, []);

  const loadingSkeletons = Array.from({ length: 6 }).map((_, i) => (
    <EventDisplaySkeleton key={i} />
  ));

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">My Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
        {(isLoading || !user) && loadingSkeletons}
        {data?.map((event) => (
          <div
            className="hover:translate-y-[-.75rem] transition duration-500"
            key={event.id}
          >
            <EventDisplay
              redirect={`/profile/events/organizer/${event.cleaned_name}`}
              event={event}
            />
          </div>
        ))}
      </div>
    </>
  );
}
