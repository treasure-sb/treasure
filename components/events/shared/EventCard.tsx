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

export default function EventCard({
  event,
  redirectTo,
  user,
  clickable = true,
  showLikeButton = true,
}: {
  event: EventDisplayData;
  redirectTo?: string;
  user?: User | null;
  clickable?: boolean;
  showLikeButton?: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div
      className={cn(
        `w-full h-25 flex items-center justify-between relative`,
        !clickable && "pointer-events-none"
      )}
    >
      <Link
        className="max-w-[90%] min-w-[90%]"
        href={redirectTo || `/events/${event.cleaned_name}`}
      >
        <div className="flex space-x-4">
          <div
            className="relative shrink-0"
            style={{
              width: "100px",
              height: "100px",
            }}
          >
            <Image
              className={`rounded-xl group-hover:bg-black object-cover object-top group-hover:opacity-50 transition duration-300 ${imageVisibility}`}
              alt="image"
              src={event.publicPosterUrl}
              fill
              sizes="100px"
              onLoad={() => setLoading(false)}
            />

            {loading && (
              <Skeleton
                className={`rounded-xl w-full h-full absolute inset-0 ${skeletonDisplay}`}
              />
            )}
          </div>

          <div className="max-w-[65%] my-auto">
            <p className="text-lg font-bold line-clamp-2">{event.name}</p>
            <p className="text-primary text-sm font-normal">
              {event.formattedDates.length > 1
                ? `${event.formattedDates[0].date} - ${
                    event.formattedDates[event.formattedDates.length - 1].date
                  }`
                : event.formattedDates[0].date}
            </p>
            <p className="text-sm font-normal truncate">
              {event.city + ", " + event.state}
            </p>
          </div>
        </div>
      </Link>
      {showLikeButton && <LikeButton event={event} user={user} />}
      {event.sales_status !== "NO_SALE" && (
        <Ticket className="stroke-2 text-primary absolute -top-2 -left-2 m-0 rounded-none -rotate-[25deg] fill-white dark:fill-black" />
      )}
    </div>
  );
}
