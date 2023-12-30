import createSupabaseServerClient from "@/utils/supabase/server";
import EventCard from "@/components/events/cards/EventCard";
import MainDisplay from "@/components/events/displays/MainDisplay";
import format from "date-fns/format";
import SeeMore from "./SeeMore";
import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";

export default async function ListUserEvents({
  filter,
  user,
}: {
  filter: string;
  user: Tables<"profiles">;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const supabase = await createSupabaseServerClient();
  let eventsAttending: Tables<"events">[] = [];
  let pastEvents: Tables<"events">[] = [];

  const { data: eventsData, error: eventsError } = await supabase
    .from("event_guests")
    .select("*, events(*)")
    .eq("guest_id", user.id)
    .order("date", { ascending: false, foreignTable: "events" });

  if (eventsData) {
    eventsData.forEach((eventData) => {
      if (eventData.events) {
        const event = eventData.events;
        const isPastEvent = new Date(event.date) < new Date(today);

        if (isPastEvent) {
          pastEvents.push(event);
        } else {
          eventsAttending.push(event);
        }
      }
    });

    pastEvents.sort(
      (a, b) => new Date(b.date).getDate() - new Date(a.date).getDate()
    );
    eventsAttending.sort(
      (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate()
    );
  }

  return (
    <>
      {filter === "Events" ? (
        <>
          {eventsAttending.length === 0 ? (
            <p className="text-center mb-6 font-semibold">
              No upcoming events {user.first_name} is attending
            </p>
          ) : (
            <>
              <p className="mb-6 font-semibold">
                Upcoming events {user.first_name} is attending
              </p>
              <div className="md:hidden block space-y-4 relative">
                <SeeMore>
                  {eventsAttending.map((event) => (
                    <EventCard
                      key={event.id + "card"}
                      event={event}
                      redirectTo={`/events/${event.cleaned_name}`}
                    />
                  ))}
                </SeeMore>
              </div>
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
                <SeeMore>
                  {eventsAttending.map((event) => (
                    <MainDisplay key={event.id + "display"} event={event} />
                  ))}
                </SeeMore>
              </div>
            </>
          )}
          <Separator className="my-6" />
          {pastEvents.length === 0 ? (
            <p className="text-center mb-6 font-semibold">
              No past events attended by {user.first_name}
            </p>
          ) : (
            <>
              <p className="mb-6 font-semibold">
                Past events {user.first_name} attended
              </p>
              <div className="md:hidden block space-y-4 relative">
                <SeeMore>
                  {pastEvents.map((event) => (
                    <EventCard
                      event={event}
                      redirectTo={`/events/${event.cleaned_name}`}
                    />
                  ))}
                </SeeMore>
              </div>
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
                <SeeMore>
                  {pastEvents.map((event) => (
                    <MainDisplay event={event} />
                  ))}
                </SeeMore>
              </div>
            </>
          )}
        </>
      ) : null}
    </>
  );
}
