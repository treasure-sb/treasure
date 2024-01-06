import EventCard from "@/components/events/shared/EventCard";
import EventDisplay from "@/components/events/shared/EventDisplay";
import format from "date-fns/format";
import SeeMore from "./SeeMore";
import { getUserEventsDisplayData } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";

export default async function ListUserEvents({
  filter,
  user,
}: {
  filter: string;
  user: any;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  let eventsAttending: Tables<"events">[] = [];
  let pastEvents: Tables<"events">[] = [];

  const events = await getUserEventsDisplayData(1, "Attending", user);

  if (events) {
    events.forEach((event) => {
      if (event) {
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
                      showLikeButton={false}
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
                    <EventDisplay
                      key={event.id + "display"}
                      event={event}
                      showLikeButton={false}
                    />
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
                      showLikeButton={false}
                      event={event}
                      redirectTo={`/events/${event.cleaned_name}`}
                    />
                  ))}
                </SeeMore>
              </div>
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:relative">
                <SeeMore>
                  {pastEvents.map((event) => (
                    <EventDisplay event={event} showLikeButton={false} />
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
