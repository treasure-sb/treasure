import createSupabaseServerClient from "@/utils/supabase/server";
import FeaturedEventDisplay from "./FeaturedEventDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import format from "date-fns/format";
import { Tables } from "@/types/supabase";

export default async function FeaturedEvents() {
  const supabase = await createSupabaseServerClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .range(0, 5);

  let events: Tables<"events">[] = [];
  if (eventsData) {
    events = eventsData;
  }

  const eventsA = events.slice(0, 4);
  const eventsB = events.slice(4, 6);

  return (
    <div className="w-full flex flex-col justify-center">
      <h1 className="font-bold text-3xl mb-10 text-center md:text-5xl">
        Featured Events
      </h1>
      <div className="grid sm:h-auto grid-cols-2 md:grid-cols-3 gap-5">
        {eventsA.map((event) => (
          <FeaturedEventDisplay key={event.id} event={event} />
        ))}
        {eventsB.map((event) => (
          <div className="hidden sm:block">
            <FeaturedEventDisplay key={event.id} event={event} />
          </div>
        ))}
      </div>
      <Link
        href="/events"
        className="w-full max-w-md sm:w-80 mx-auto sm:mt-10 mt-6"
      >
        <Button className="landing-page-button w-full">See All Events</Button>
      </Link>
    </div>
  );
}
