import createSupabaseServerClient from "@/utils/supabase/server";
import FeaturedEventDisplay from "./FeaturedEventDisplay";
import Link from "next/link";
import format from "date-fns/format";
import { Tables } from "@/types/supabase";
import ArrowPointingRight from "../icons/ArrowPointingRight";

export default async function FeaturedEvents() {
  const supabase = await createSupabaseServerClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .order("featured", { ascending: false })
    .gte("date", today)
    .range(0, 5);

  const events: Tables<"events">[] = eventsData || [];
  const eventsA = events.slice(0, 4);
  const eventsB = events.slice(4, 6);

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex space-x-4 items-center mb-6">
        <h1 className="font-semibold text-2xl md:text-3xl">Featured Events</h1>
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
