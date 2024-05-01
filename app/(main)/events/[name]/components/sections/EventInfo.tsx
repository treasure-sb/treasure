import { Tables } from "@/types/supabase";
import { convertToStandardTime } from "@/lib/utils";
import { formatDate } from "@/lib/helpers/events";
import { ArrowUpRight, MapPinIcon } from "lucide-react";
import Link from "next/link";

const months: { [key: number]: string } = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

const EventCalendar = ({ month, day }: { month: number; day: number }) => {
  return (
    <div className="border-[1px] border-foreground/30 text-foreground/60 rounded-sm text-center w-10">
      <p className="border-b-[1px] border-foreground/30 px-2 text-xxs">
        {months[month]}
      </p>
      <p className="px-2 mx-auto text-md">{day}</p>
    </div>
  );
};

export default function EventInfo({ event }: { event: Tables<"events"> }) {
  const formattedDate = formatDate(event.date);
  const formattedStartTime = convertToStandardTime(event.start_time);
  const formattedEndTime = convertToStandardTime(event.end_time);

  const eventMonth = parseInt(event.date.split("-")[1]);
  const eventDay = parseInt(event.date.split("-")[2]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.address
  )}`;

  return (
    <section className="space-y-2">
      <div className="flex space-x-4 items-center">
        <EventCalendar month={eventMonth} day={eventDay} />
        <div>
          <p>{formattedDate}</p>
          <p>
            {formattedStartTime} - {formattedEndTime}
          </p>
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
