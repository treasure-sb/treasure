import EventCardSkeleton from "@/components/events/skeletons/EventCardSkeleton";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfileListEvents() {
  const CardSkeletonElements = Array.from({ length: 3 }, (_, index) => (
    <EventCardSkeleton key={`event-card-skeleton-${index}`} />
  ));
  const DesktopSkeletonElements = Array.from({ length: 12 }, (_, index) => (
    <EventDisplaySkeleton key={`desktop-display-skeleton-${index}`} />
  ));

  return (
    <>
      <Skeleton className="my-6 h-4 w-80" />
      <div className="space-y-6 block md:hidden">{CardSkeletonElements}</div>
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DesktopSkeletonElements}
      </div>
    </>
  );
}
