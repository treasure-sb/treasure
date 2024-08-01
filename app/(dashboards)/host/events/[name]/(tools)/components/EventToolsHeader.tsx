"use client";

import { EventDisplayData } from "@/types/event";
import { ArrowUpLeft, ArrowUpRight, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RoleMapKey } from "../team/components/ListMembers";
import { cn } from "@/lib/utils";
import EventPoster from "@/components/events/shared/EventPoster";
import Link from "next/link";
import CopyEventLink from "./CopyEventLink";

export default function EventToolsHeader({
  event,
  role,
}: {
  event: EventDisplayData;
  role: RoleMapKey;
}) {
  const pathname = usePathname();
  const splitPathname = pathname.split("/");

  const isEventTool =
    splitPathname.length > 4 &&
    (splitPathname[4] === "vendors" ||
      splitPathname[4] === "message" ||
      splitPathname[4] === "attendees" ||
      splitPathname[4] === "sales" ||
      splitPathname[4] === "edit" ||
      splitPathname[4] === "views" ||
      splitPathname[4] === "team");

  return (
    <div>
      {isEventTool ? (
        <Link
          href={`/host/events/${event.cleaned_name}`}
          className="flex space-x-1 items-center mb-4 group cursor-pointer w-fit"
        >
          <ArrowUpLeft className="group-hover:-translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] transition duration-300" />
          <p className="md:text-lg">Event Tools</p>
        </Link>
      ) : (
        <Link
          href={`/host/events`}
          className="flex space-x-1 items-center mb-4 group cursor-pointer w-fit"
        >
          <ArrowUpLeft className="group-hover:-translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] transition duration-300" />
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
          <Button
            asChild={role !== "SCANNER"}
            variant="secondary"
            className={cn(
              "flex gap-2",
              role === "SCANNER" && "opacity-50 cursor-not-allowed"
            )}
            disabled={role === "SCANNER"}
          >
            {role === "SCANNER" ? (
              <span>Edit Event</span>
            ) : (
              <Link href={`/host/events/${event.cleaned_name}/edit`}>
                Edit Event
              </Link>
            )}
          </Button>

          <div className="flex space-x-1">
            <Button asChild variant={"ghost"} className="flex gap-2 group">
              <Link href={`/host/events/${event.cleaned_name}/team`}>
                <Users
                  size={20}
                  className="group-hover:-translate-y-[0.10rem] transition duration-300"
                />
                <span>Manage Team</span>
              </Link>
            </Button>
            <CopyEventLink cleaned_event_name={event.cleaned_name} />
            <Button asChild variant="ghost" className="flex space-x-1 group">
              <Link href={`/events/${event.cleaned_name}`}>
                <span>Go to Event</span>
                <ArrowUpRight
                  size={20}
                  className="group-hover:translate-x-[0.10rem] group-hover:-translate-y-[0.10rem] transition duration-300"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
