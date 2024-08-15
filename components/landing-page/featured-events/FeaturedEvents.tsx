import FeaturedEventDisplay from "./FeaturedEventDisplay";
import FeaturedEventCarousel from "./FeaturedEventCarousel";
import { getAllEventData } from "@/lib/helpers/eventsFiltering";
import { EventWithDates } from "@/types/event";
import LandingButton from "../LandingButton";

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
          Check out the most popular shows in your city, from Sports and Pokemon
          to Comic Books and TCG.
        </p>
        <LandingButton href="/events" variant={"outline"} text="See More" />
      </div>
    </section>
  );
}
