"use client";
import { InfiniteMovingCards } from "../../ui/infinite-moving-cards";

export default function FeaturedEventCarousel({
  featuredEvents,
}: {
  featuredEvents: JSX.Element[];
}) {
  return (
    <div className="mx-[-16px]">
      <InfiniteMovingCards events={featuredEvents} speed="slow" />
    </div>
  );
}
