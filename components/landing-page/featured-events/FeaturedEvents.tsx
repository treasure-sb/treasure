import FeaturedEventDisplay from "./FeaturedEventDisplay";
import Link from "next/link";
import ArrowPointingRight from "../../icons/ArrowPointingRight";
import FeaturedEventCarousel from "./FeaturedEventCarousel";
import { Tables } from "@/types/supabase";
import { getAllEventData } from "@/lib/helpers/eventsFiltering";

export default async function FeaturedEvents() {
  const { data: eventsData } = await getAllEventData("", 1);
  const events: Tables<"events">[] = eventsData || [];
  const eventsDisplay = events.map((event) => (
    <FeaturedEventDisplay key={event.id} event={event} />
  ));

  return (
    <section className="mt-[-10vh]">
      <div className="flex space-x-4 items-center mb-6 max-w-[var(--container-width)] m-auto">
        <h1 className="font-semibold text-xl">Trending</h1>
      </div>
      <FeaturedEventCarousel featuredEvents={eventsDisplay} />
      <div className="max-w-[var(--container-width)] m-auto mt-10 mb-6 flex justify-between items-center">
        <p className="text-sm md:text-xl w-60 md:w-[40rem] lg:w-fit">
          The most popular shows in your city, from Sports and Comics to Pokemon
          and TCG.
        </p>
        <Link
          className="flex items-center space-x-2 group md:text-base text-xs"
          href="/events"
        >
          <p>See More</p>
          <ArrowPointingRight className="group-hover:translate-x-1 transition duration-300 text-tertiary" />
        </Link>
      </div>
    </section>
  );
}
