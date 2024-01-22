import { useUser } from "@/app/(dashboards)/query";
import { useStore } from "../../store";
import { useHostedEvents } from "../../query";
import EventDisplay from "@/components/events/shared/EventDisplay";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";

export default function AllEvents() {
  const { data, isLoading } = useHostedEvents();
  const { setCurrentEvent } = useStore();
  const user = useUser();

  const loadingSkeletons = Array.from({ length: 6 }).map((_, i) => (
    <EventDisplaySkeleton key={i} />
  ));

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
      {(isLoading || !user) && loadingSkeletons}
      {data?.map((event) => (
        <div
          onClick={() => setCurrentEvent(event)}
          className="hover:translate-y-[-.75rem] transition duration-500 pointer-events-auto cursor-pointer"
          key={event.id}
        >
          <div className="pointer-events-none">
            <EventDisplay
              user={user}
              showLikeButton={false}
              redirect={`/profile/events/organizer/${event.cleaned_name}`}
              event={event}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
