"use client";

import { useTables } from "../query";
import { useUser } from "../../query";
import EventDisplay from "@/components/events/shared/EventDisplay";

export default function Page() {
  const user = useUser();
  const { data } = useTables();
  const { eventsData } = data ?? {};

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">My Tables</h1>
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
        {eventsData?.map((event) => (
          <div
            className="hover:translate-y-[-.75rem] transition duration-500"
            key={event.id}
          >
            <EventDisplay user={user} event={event} />
          </div>
        ))}
      </div>
    </>
  );
}
