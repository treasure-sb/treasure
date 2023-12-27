"use client";

import Link from "next/link";
import Image from "next/image";
import EventDisplaySkeleton from "@/components/events/skeletons/EventDisplaySkeleton";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { formatDate } from "@/lib/helpers/events";
import { Tables } from "@/types/supabase";

export default function ClientMainDisplay({
  event,
  onImageLoad,
}: {
  event: Tables<"events">;
  onImageLoad: (eventId: string) => void;
}) {
  const supabase = createClient();
  const { data, isLoading } = useQuery({
    queryKey: [{ event }],
    queryFn: async () => {
      const formattedDate = formatDate(event.date);
      const { data: tickets, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("event_id", event.id);
      const publicUrl = await getPublicPosterUrl(event);
      return { tickets, formattedDate, publicUrl };
    },
  });

  return isLoading || !data ? (
    <EventDisplaySkeleton />
  ) : (
    <div className="group aspect-square w-full">
      <Link href={`/events/${event.cleaned_name}`}>
        <Image
          className="object-cover h-full w-full rounded-md"
          alt="image"
          src={data.publicUrl}
          onLoad={() => onImageLoad(event.id)}
          width={200}
          height={200}
        />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-primary">{data.formattedDate}</span>{" "}
          {event.venue_name}
        </h1>
        <div>
          {data.tickets?.map((ticket) => (
            <h1 key={ticket.id}>
              ${ticket.price} {ticket.name}
            </h1>
          ))}
        </div>
      </Link>
    </div>
  );
}
