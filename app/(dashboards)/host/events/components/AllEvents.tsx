import { eventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventCardSkeleton from "@/components/events/skeletons/EventCardSkeleton";
import EventCard from "@/components/events/shared/EventCard";

export default async function AllEvents() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .order("date", { ascending: true });

  if (!data || error) {
    redirect("/events");
  }

  const eventsHosting: Tables<"events">[] = data || [];
  const eventData = await eventDisplayData(eventsHosting);

  const loadingSkeletons = Array.from({ length: 6 }).map((_, i) => (
    <EventCardSkeleton key={i} />
  ));

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-16">
      {!data && loadingSkeletons}
      {eventData.map((event) => (
        <div className="hover:translate-y-[-.5rem] transition duration-500">
          <EventCard
            user={user}
            showLikeButton={false}
            redirectTo={`/host/events/${event.cleaned_name}`}
            event={event}
          />
        </div>
      ))}
    </div>
  );
}
