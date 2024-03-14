import { Tables } from "@/types/supabase";
import { convertToStandardTime } from "@/lib/utils";
import { formatDate } from "@/lib/helpers/events";

export default function EventHeading({ event }: { event: Tables<"events"> }) {
  const formattedDate = formatDate(event.date);
  const formattedStartTime = convertToStandardTime(event.start_time);
  const formattedEndTime = convertToStandardTime(event.end_time);
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-semibold">{event.name}</h1>
      <div>
        <p className="font-semibold">{event.venue_name}</p>
        <p className="text-tertiary">
          {formattedDate} at {formattedStartTime} - {formattedEndTime}
        </p>
      </div>
    </section>
  );
}
