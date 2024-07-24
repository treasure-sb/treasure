"use client";
import Link from "next/link";
import Image from "next/image";
import { EventDisplayData } from "@/types/event";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NextEventCard({
  event,
  redirectTo,
}: {
  event: EventDisplayData;
  redirectTo: string;
}) {
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div className="rounded-md bg-secondary/30 w-full md:w-[32rem]">
      <Link
        href={redirectTo}
        scroll={true}
        className="flex md:flex-col items-center space-x-2 md:items-start"
      >
        <div className="w-[50%] md:w-full flex-shrink-0">
          <div className="relative aspect-w-1 aspect-h-1">
            <Image
              className={`object-cover object-top rounded-md rounded-r-none md:rounded-b-none md:rounded-t-md ${imageVisibility}`}
              alt="image"
              src={event.publicPosterUrl}
              layout="fill"
              onLoad={() => setLoading(false)}
            />
            {loading && (
              <Skeleton className={`absolute inset-0 ${skeletonDisplay}`} />
            )}
          </div>
        </div>
        <div className="p-2">
          <p className="text-base md:text-xl mt-2 font-semibold line-clamp-2">
            {event.name}
          </p>
          <p className="text-sm md:text-base font-normal">
            <span className="font-normal text-primary">
              {event.formattedDate}
            </span>
            {" | "}
            {event.city + ", " + event.state}
          </p>
        </div>
      </Link>
    </div>
  );
}
