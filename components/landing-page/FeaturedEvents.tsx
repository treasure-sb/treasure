import createSupabaseServerClient from "@/utils/supabase/server";
import FeaturedEventDisplay from "./FeaturedEventDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function FeaturedEvents() {
  const supabase = await createSupabaseServerClient();
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .limit(4);

  return (
    <div className="w-full flex flex-col justify-center">
      <h1 className="font-bold text-3xl mb-10 text-center md:text-5xl">
        Featured Events
      </h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {events?.map((event) => (
          <FeaturedEventDisplay key={event.id} event={event} />
        ))}
      </div>
      <Link href="/events" className="w-full max-w-md md:w-80 mx-auto mt-10">
        <Button className="landing-page-button w-full">See All Events</Button>
      </Link>
    </div>
  );
}
