import { formatDates } from "@/lib/utils";
import { ArrowUpRight, MapPinIcon } from "lucide-react";
import Link from "next/link";
import EventCalendar from "@/components/ui/custom/event-calendar";

export type EventDates = {
  date: string;
  start_time: string;
  end_time: string;
};

type EventInfoProps = {
  dates: EventDates[];
  address: string;
  venueName: string;
};

export default function EventInfo({
  dates,
  address,
  venueName,
}: EventInfoProps) {
  let formattedDates = formatDates(dates);

  const eventMonth =
    dates.length > 0 ? parseInt(dates[0]["date"].split("-")[1]) : 0;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const eventDays = dates.map((date) => parseInt(date.date.split("-")[2]));

  return (
    <section className="space-y-2">
      {formattedDates.length >= 1 && (
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
      )}
      {address && venueName && (
        <div className="flex space-x-4">
          <div className="w-10">
            <MapPinIcon className="m-auto stroke-1 text-foreground/60" />
          </div>
          <Link target="_blank" href={googleMapsUrl} className="relative group">
            <p>{venueName}</p>
            <ArrowUpRight
              size={18}
              className="stroke-1 absolute -right-5 top-0 text-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 group-hover:text-foreground"
            />
          </Link>
        </div>
      )}
    </section>
  );
}
