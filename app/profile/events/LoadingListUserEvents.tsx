import EventCardSkeleton from "@/components/events/skeletons/EventCardSkeleton";

export default function LoadingListUserEvents() {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <EventCardSkeleton />
      <EventCardSkeleton />
      <EventCardSkeleton />
    </div>
  );
}
