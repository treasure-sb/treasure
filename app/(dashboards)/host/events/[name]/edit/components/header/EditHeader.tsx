"use client";

import { EventDisplayData } from "@/types/event";
import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import EventPoster from "@/components/events/shared/EventPoster";
import EditEventForm from "./EditEventForm";

export default function EditHeader({ event }: { event: EventDisplayData }) {
  return (
    <div>
      <Link
        href={`/host/events/${event.cleaned_name}`}
        className="flex space-x-1 items-center mb-4 group cursor-pointer w-fit"
      >
        <ArrowUpLeft className="group-hover:-translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] transition duration-300" />
        <p className="md:text-lg">Event Tools</p>
      </Link>
      <h2 className="font-semibold mb-2">Basic Event Details</h2>
      <EditEventForm event={event} />
    </div>
  );
}
