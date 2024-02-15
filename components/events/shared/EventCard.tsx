"use client";

import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/events/shared/LikeButton";

export default function EventCard({
  redirectTo,
  event,
  user,
  showLikeButton = true,
}: {
  redirectTo?: string;
  user?: User | null;
  event: EventDisplayData;
  showLikeButton?: boolean;
}) {
  const { publicPosterUrl, formattedDate } = event;
  const [loading, setLoading] = useState(true);
  const imageVisibility = loading ? "invisible" : "visible";
  const skeletonDisplay = loading ? "inline-block" : "hidden";

  return (
    <div className="w-full h-25 flex items-center justify-betwee">
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
              className={`rounded-xl group-hover:bg-black group-hover:opacity-50 transition duration-300 ${imageVisibility}`}
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
          <div className="max-w-[65%] my-auto">
            <p className="text-lg font-bold line-clamp-2">{event.name}</p>
            <p className="text-primary text-sm font-normal">{formattedDate} </p>
            <p className="text-sm font-normal truncate">
              {event.city + ", " + event.state}
            </p>
          </div>
        </div>
      </Link>
      {showLikeButton && <LikeButton event={event} user={user} />}
    </div>
  );
}
