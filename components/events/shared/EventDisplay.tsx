"use client";

import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/events/shared/LikeButton";
import { Ticket } from "lucide-react";

export default function EventDisplay({
  event,
  user,
  redirect,
  clickable = true,
  showLikeButton = true,
  showTicket = true,
}: {
  user?: User | null;
  event: EventDisplayData;
  redirect?: string;
  clickable?: boolean;
  showLikeButton?: boolean;
  showTicket?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div
      className={cn(
        "group w-full relative",
        !clickable && "pointer-events-none"
      )}
    >
      {showLikeButton && (
        <div className="absolute right-2 top-2 p-2 h-9 bg-black bg-opacity-30 backdrop-blur-sm rounded-full z-10 hover:bg-black/50 transition duration-500">
          <LikeButton event={event} user={user} isDisplay={true} />
        </div>
      )}

      <Link href={redirect || `/events/${event.cleaned_name}`} scroll={true}>
        <div className="relative aspect-w-1 aspect-h-1">
          <Image
            className={`object-cover object-top h-full w-full rounded-md ${imageVisibility}`}
            alt="image"
            src={event.publicPosterUrl}
            width={200}
            height={200}
            onLoad={() => setLoading(false)}
          />
          {loading && (
            <Skeleton
              className={`w-full h-full absolute inset-0 ${skeletonDisplay}`}
            />
          )}
        </div>
        <p className="text-xl mt-2 font-bold line-clamp-2">{event.name}</p>
        <p className="text-base font-normal">
          <span className="text-primary text-base font-normal">
            {event.formattedDates.length > 1
              ? `${event.formattedDates[0].date} - ${
                  event.formattedDates[event.formattedDates.length - 1].date
                }`
              : event.formattedDates[0].date}
          </span>{" "}
          {event.city + ", " + event.state}
        </p>
      </Link>
      {showTicket && event.sales_status !== "NO_SALE" && (
        <Ticket
          className="stroke-1 text-foreground dark:text-primary absolute -top-2 -left-2 m-0 rounded-none -rotate-[25deg] fill-primary dark:fill-black"
          size={32}
        />
      )}
    </div>
  );
}
