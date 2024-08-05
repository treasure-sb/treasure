"use client";

import { EventDisplayData } from "@/types/event";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function RegularEventCard({
  event,
  redirectTo,
}: {
  event: EventDisplayData;
  redirectTo?: string;
}) {
  const { publicPosterUrl, formattedDates } = event;
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div className="h-fit rounded-md flex items-center justify-between relative bg-secondary/30">
      <Link
        href={redirectTo || `/events/${event.cleaned_name}`}
        className="w-full p-2"
      >
        <div className="flex space-x-4 w-full">
          <div
            className="relative shrink-0"
            style={{
              width: "140px",
              height: "140px",
            }}
          >
            <Image
              className={`rounded-xl group-hover:bg-black object-cover object-top group-hover:opacity-50 transition duration-300 ${imageVisibility}`}
              alt="image"
              src={publicPosterUrl}
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

          <div className="my-auto">
            <p className="text-lg font-bold line-clamp-2">{event.name}</p>
            <p className="text-primary text-sm font-normal">
              {formattedDates[0].date}{" "}
            </p>
            <p className="text-sm font-normal truncate">
              {event.city + ", " + event.state}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
