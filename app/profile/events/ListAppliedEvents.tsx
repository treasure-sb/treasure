import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import EventCard from "@/components/events/events-public/EventCard";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default async function ListUserEvents({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const { data: appliedEventsData, error: appliedEventsError } = await supabase
    .from("vendor_applications")
    .select("events(*)")
    .eq("vendor_id", user.id);

  const appliedEvents = appliedEventsData?.map((event) => event.events);

  return (
    <>
      {!appliedEvents ? (
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            You have not applied to be a vendor at any event
          </div>
          <Link href="/events" className="m-auto">
            <Button className="w-40">Apply Now!</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {appliedEvents.map((event: any) => (
            <EventCard
              redirectTo={
                user.id === event.organizer_id
                  ? `/profile/events/organizer/${event.id}`
                  : `/events/${event.id}`
              }
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </>
  );
}
