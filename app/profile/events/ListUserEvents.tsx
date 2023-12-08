import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import EventCard from "@/components/events/cards/EventCard";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import AttendingDisplay from "@/components/events/displays/AttendingDisplay";
import ListEvents from "@/components/events/shared/ListEvents";

export default async function ListUserEvents({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id);

  let events: Tables<"events">[] = [];
  if (eventData) {
    events = eventData;
  }

  return (
    <>
      {events.length === 0 ? (
        <div className="flex flex-col space-y-4">
          <div className="text-center">You are attending no events</div>
          <Link href="/profile/create-event" className="m-auto">
            <Button className="w-40">Create Event</Button>
          </Link>
        </div>
      ) : (
        <ListEvents
          events={events}
          DisplayComponent={AttendingDisplay}
          CardComponent={EventCard}
        />
      )}
    </>
  );
}
