import { eventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";
import EventDisplay from "@/components/events/shared/EventDisplay";

export default async function AllEvents() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .order("date", { ascending: true });

  const eventsHosting: Tables<"events">[] = data || [];
  const eventData = await eventDisplayData(eventsHosting);

  const loadingSkeletons = Array.from({ length: 6 }).map((_, i) => (
    <EventDisplaySkeleton key={i} />
  ));

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
      {!data && loadingSkeletons}
      {eventData.map((event) => (
        <div className="hover:translate-y-[-.5rem] transition duration-500">
          <EventDisplay
            user={user}
            showLikeButton={false}
            redirect={`/host/events/${event.cleaned_name}`}
            event={event}
          />
        </div>
      ))}
    </div>
  );
}
