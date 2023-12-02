import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EventCard from "@/components/events/events-public/EventCard";
import { Tables } from "@/types/supabase";

export default async function Page() {
  const { data: userData } = await validateUser();
  if (!userData.user) {
    redirect("/account");
  }

  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userData.user.id);

  let events: Tables<"events">[] = [];
  if (eventData) {
    events = eventData;
  }

  return (
    <main className="w-full max-w-md m-auto">
      {events.length === 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="text-center">You are hosting no events</div>
          <Link href="/profile/create-event" className="m-auto">
            <Button className="w-40">Create Event</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="font-bold text-2xl mb-6">My Events</div>
          {events.map((event) => (
            <EventCard
              redirectTo={
                userData.user.id === event.organizer_id
                  ? `/profile/events/organizer/${event.id}`
                  : `/events/${event.id}`
              }
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </main>
  );
}
