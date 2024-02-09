"use client";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function FeaturedEventCarousel({
  featuredEvents,
}: {
  featuredEvents: JSX.Element[];
}) {
  return <InfiniteMovingCards events={featuredEvents} speed="slow" />;
}
