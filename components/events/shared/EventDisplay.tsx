"use client";
import { User } from "@supabase/supabase-js";
import { EventDisplayData } from "@/types/event";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "@/components/events/shared/LikeButton";

export default function CardDisplay({
  event,
  user,
  showLikeButton = true,
}: {
  user?: User | null;
  event: EventDisplayData;
  showLikeButton?: boolean;
}) {
  return (
    <div className="group aspect-square w-full relative">
      {showLikeButton && (
        <div className="absolute right-2 top-2 p-2 bg-black rounded-full">
          <LikeButton event={event} user={user} />
        </div>
      )}

      <Link href={`/events/${event.cleaned_name}`}>
        <Image
          className="object-cover h-full w-full rounded-md"
          alt="image"
          src={event.publicPosterUrl}
          width={200}
          height={200}
        />

        <h1 className="text-xl mt-2 font-bold line-clamp-2">{event.name}</h1>
        <h1 className="text-base font-normal">
          <span className="text-primary text-base font-normal">
            {event.formattedDate}
          </span>{" "}
          {event.city + ", " + event.state}
        </h1>
      </Link>
    </div>
  );
}
