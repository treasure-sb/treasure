import { EventWithDates } from "@/types/event";
import { formatDates } from "@/lib/utils";
import { ArrowUpRight, MapPinIcon } from "lucide-react";
import Link from "next/link";
import EventCalendar from "@/components/ui/custom/event-calendar";

export default function EventInfo({ event }: { event: EventWithDates }) {
  let formattedDates: { date: string; start_time: string; end_time: string }[] =
    formatDates(event.dates);

  const eventMonth = parseInt(event.dates[0]["date"].split("-")[1]);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;

  const eventDays = event.dates.map((date) =>
    parseInt(date.date.split("-")[2])
  );

  return (
    <section className="space-y-2">
      <div className="flex space-x-4 items-center">
        <EventCalendar month={eventMonth} days={eventDays} />
        <div className="flex-col">
          {formattedDates.length > 1 ? (
            formattedDates.map((date) => (
              <div className="flex">
                <p>
                  {date.date}{" "}
                  <span className="text-[0.6rem] text-tertiary">{`${date.start_time} - ${date.end_time}`}</span>
                </p>
              </div>
            ))
          ) : (
            <div>
              <p>{formattedDates[0].date}</p>
              <p>
                {formattedDates[0].start_time} - {formattedDates[0].end_time}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-10">
          <MapPinIcon className="m-auto stroke-1 text-foreground/60" />
        </div>
        <Link target="_blank" href={googleMapsUrl} className="relative group">
          <p>{event.venue_name}</p>
          <ArrowUpRight
            size={18}
            className="stroke-1 absolute -right-5 top-0 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
          />
        </Link>
      </div>
    </section>
  );
}
