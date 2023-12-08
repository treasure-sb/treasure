import { Skeleton } from "@/components/ui/skeleton";
import EventCardSkeleton from "@/components/events/skeletons/EventCardSkeleton";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";

export default function LoadingListEvents() {
  const SkeletonElements = Array.from({ length: 11 }, (_, index) => (
    <EventCardSkeleton key={`event-card-skeleton-${index}`} />
  ));
  const DesktopSkeletonElements = Array.from({ length: 12 }, (_, index) => (
    <EventDisplaySkeleton key={`desktop-display-skeleton-${index}`} />
  ));

  return (
    <>
      <div className="space-y-8 md:hidden">
        <EventDisplaySkeleton />
        {SkeletonElements}
      </div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DesktopSkeletonElements}
      </div>
    </>
  );
}
