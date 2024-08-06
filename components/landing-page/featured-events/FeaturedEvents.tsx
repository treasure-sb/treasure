import FeaturedEventDisplay from "./FeaturedEventDisplay";
import Link from "next/link";
import FeaturedEventCarousel from "./FeaturedEventCarousel";
import { Tables } from "@/types/supabase";
import { getAllEventData } from "@/lib/helpers/eventsFiltering";
import { LucideArrowUpRight } from "lucide-react";
import { EventWithDates } from "@/types/event";

export default async function FeaturedEvents() {
  const { data: eventsData } = await getAllEventData("", 1);
  const events: EventWithDates[] = eventsData || [];
  const eventsDisplay = events.map((event) => (
    <FeaturedEventDisplay key={event.id} event={event} />
  ));

  return (
    <section>
      <div className="flex space-x-4 items-center mb-6 max-w-[var(--container-width)] m-auto">
        <h3 className="font-semibold text-xl lg:text-2xl">Trending</h3>
      </div>
      <FeaturedEventCarousel featuredEvents={eventsDisplay} />
      <div className="max-w-[var(--container-width)] m-auto mt-10 mb-6 flex justify-between items-center">
        <p className="text-sm md:text-xl max-w-[16rem] md:max-w-lg lg:max-w-none">
          The most popular shows in your city, from Sports and Comics to Pokemon
          and TCG.
        </p>
        <Link
          className="flex items-center space-x-1 group text-xs md:text-xl"
          href="/events"
        >
          <p className="group-hover:text-foreground/80 transition duration-300 font-semibold">
            See More
          </p>
          <LucideArrowUpRight
            size={26}
            className="hidden md:block group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300"
          />
          <LucideArrowUpRight
            size={20}
            className="block md:hidden group-hover:text-foreground/80 group-hover:translate-x-[0.1rem] group-hover:-translate-y-[0.1rem] transition duration-300"
          />
        </Link>
      </div>
    </section>
  );
}
