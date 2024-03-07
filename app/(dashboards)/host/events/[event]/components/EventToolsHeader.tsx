"use client";

import { EventDisplayData } from "@/types/event";
import { motion } from "framer-motion";
import { MoveLeftIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import EventPoster from "@/components/events/shared/EventPoster";
import Link from "next/link";

export default function EventToolsHeader({
  event,
}: {
  event: EventDisplayData;
}) {
  const pathname = usePathname();
  const isEventTool =
    pathname.includes("vendors") ||
    pathname.includes("message") ||
    pathname.includes("sales");

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
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
      <div className="flex gap-4 items-start justify-between">
        <h1 className="my-2 text-3xl font-semibold">{event.name}</h1>
        <div className="w-32">
          <EventPoster posterUrl={event.publicPosterUrl} />
        </div>
      </div>
    </motion.div>
  );
}
