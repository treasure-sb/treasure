"use client";

import Link from "next/link";
import Image from "next/image";
import { Tables } from "@/types/supabase";

export default function ClientMainDisplay({
  event,
}: {
  event: Tables<"events"> & {
    tickets: any[];
    publicPosterUrl: string;
    formattedDate: string;
  };
}) {
  return (
    <div className="group aspect-square w-full">
      <Link href={`/events/${event.cleaned_name}`}>
        <Image
          className="object-cover h-full w-full rounded-md"
          alt="image"
          src={event.publicPosterUrl}
          width={200}
          height={200}
        />
        <h1 className="text-xl mt-2">{event.name}</h1>
        <h1>
          <span className="text-primary">{event.formattedDate}</span>{" "}
          {event.venue_name}
        </h1>
        <div>
          {event.tickets?.map((ticket: any) => (
            <h1 key={ticket.id}>
              ${ticket.price} {ticket.name}
            </h1>
          ))}
        </div>
      </Link>
    </div>
  );
}
