"use client";

import { EventDisplayData } from "@/types/event";
import { motion } from "framer-motion";
import { MoveLeftIcon } from "lucide-react";
import { MoveRightIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import EventPoster from "@/components/events/shared/EventPoster";
import Link from "next/link";
import CopyEventLink from "./CopyEventLink";

export default function EventToolsHeader({
  event,
}: {
  event: EventDisplayData;
}) {
  const pathname = usePathname();
  const isEventTool =
    pathname.includes("vendors") ||
    pathname.includes("message") ||
    pathname.includes("attendees") ||
    pathname.includes("edit");

  return (
    <div>
      {isEventTool ? (
        <Link
          href={`/host/events/${event.cleaned_name}`}
          className="flex items-center mb-4 group cursor-pointer w-fit"
        >
          <MoveLeftIcon className="mr-2 stroke-1 group-hover:translate-x-[-0.25rem] transition duration-300" />
          <p className="md:text-lg">Event Tools</p>
        </Link>
      ) : (
        <Link
          href={`/host/events`}
          className="flex items-center mb-4 group cursor-pointer w-fit"
        >
          <MoveLeftIcon className="mr-2 stroke-1 group-hover:translate-x-[-0.25rem] transition duration-300" />
          <p className="md:text-lg">All Events</p>
        </Link>
      )}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
        <div className="flex gap-4 items-center">
          <div className="w-40">
            <EventPoster posterUrl={event.publicPosterUrl} />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">{event.name}</h2>
            <p className="text-primary">{event.formattedDate}</p>
            <p className="text-sm font-normal truncate">
              {event.city + ", " + event.state}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <Link
            href={`/host/events/${event.cleaned_name}/edit`}
            className="group cursor-pointer"
          >
            <Button variant={"secondary"} className="flex gap-2">
              <p>Event Info</p>
            </Button>
          </Link>
          <div className="flex gap-2">
            <CopyEventLink cleaned_event_name={event.cleaned_name} />
            <Link
              href={`/events/${event.cleaned_name}`}
              className="group cursor-pointer"
            >
              <Button variant={"secondary"} className="flex gap-2">
                <p>Go to Event</p>
                <MoveRightIcon className="mr-2 stroke-1 group-hover:translate-x-[0.25rem] transition duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
