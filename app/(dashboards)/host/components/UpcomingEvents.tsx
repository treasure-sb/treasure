import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import createSupabaseServerClient from "@/utils/supabase/server";
import { EventDisplayData, EventWithDates } from "@/types/event";
import { eventDisplayData } from "@/lib/helpers/events";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

type EventQueryData = EventWithDates & {
  roles: {
    user_id: string;
    role: string;
    status: string;
  }[];
};

const EventLink = ({ event }: { event: EventDisplayData }) => {
  return (
    <Link
      className="rounded-sm p-2 flex space-x-4 items-center hover:bg-secondary/40"
      href={`/host/events/${event.cleaned_name}`}
    >
      <Image
        className="rounded-sm group-hover:bg-black object-cover object-top group-hover:opacity-50 transition duration-300"
        alt="image"
        src={event.publicPosterUrl}
        width={70}
        height={70}
      />
      <div>
        <p>{event.name}</p>
        <p className="text-muted-foreground text-sm font-normal">
          {event.formattedDates.length > 1
            ? `${event.formattedDates[0].date} - ${
                event.formattedDates[event.formattedDates.length - 1].date
              }`
            : event.formattedDates[0].date}
        </p>
      </div>
    </Link>
  );
};

export default async function UpcomingEvents({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("events")
    .select(
      "*, dates:event_dates(date, start_time, end_time), roles:event_roles!inner(user_id, role, status)"
    )
    .eq("roles.user_id", user.id)
    .eq("roles.status", "ACTIVE")
    .in("roles.role", ["HOST", "COHOST", "STAFF", "SCANNER"])
    .order("min_date", { ascending: true })
    .limit(4);

  const events: EventQueryData[] = data || [];
  const eventsWithDates: EventWithDates[] = events.map((event) => {
    const { roles, ...rest } = event;
    return {
      ...rest,
    };
  });
  const eventsDisplay = await eventDisplayData(eventsWithDates);

  return (
    <Card className="w-full md:w-1/2 h-[31rem]">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between">
          <p>Upcoming Events</p>
          <Link
            className="text-sm font-normal text-muted-foreground"
            href="/host/events"
          >
            See All
          </Link>
        </CardTitle>
        <CardDescription>{}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[300px] flex flex-col items-center">
        {eventsDisplay.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-32">
            You don't have any upcoming events.
          </p>
        ) : (
          <div className="w-full space-y-2">
            {eventsDisplay.map((event, index) => (
              <>
                <EventLink key={index} event={event} />
                {index < eventsDisplay.length - 1 && <Separator />}
              </>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}