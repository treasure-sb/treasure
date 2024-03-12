"use client";
import { convertToStandardTime } from "@/lib/utils";
import { EventDisplayData } from "@/types/event";

export default function EventInformation({
  event,
}: {
  event: EventDisplayData;
}) {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Event Information</h1>
        <div className="space-y-2">
          <p>
            <span className="text-primary">Name:</span> {event.name}
          </p>
          <p>
            <span className="text-primary">Date:</span>{" "}
            {new Date(event.date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <p>
            <span className="text-primary ">From:</span>{" "}
            {convertToStandardTime(event.start_time)}
          </p>
          <p>
            <span className="text-primary">Until:</span>{" "}
            {convertToStandardTime(event.end_time)}
          </p>
        </div>
      </div>
    </div>
  );
}
