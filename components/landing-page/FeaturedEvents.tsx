import FeaturedEventDisplay from "./FeaturedEventDisplay";
import Link from "next/link";
import ArrowPointingRight from "../icons/ArrowPointingRight";
import { Tables } from "@/types/supabase";
import { getAllEventData } from "@/lib/helpers/eventsFiltering";

export default async function FeaturedEvents() {
  const { data: eventsData } = await getAllEventData("", 1);
  const events: Tables<"events">[] = eventsData || [];
  const eventsA = events.slice(0, 4);
  const eventsB = events.slice(4, 6);

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex space-x-4 items-center mb-6">
        <h1 className="font-semibold text-2xl md:text-3xl">Trending</h1>
        <Link className="flex items-center space-x-2 group" href="/events">
          <p>See More</p>
          <ArrowPointingRight className="group-hover:translate-x-1 transition duration-300" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsA.map((event) => (
          <FeaturedEventDisplay key={event.id} event={event} />
        ))}
        {eventsB.map((event) => (
          <div className="hidden sm:block">
            <FeaturedEventDisplay key={event.id} event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
