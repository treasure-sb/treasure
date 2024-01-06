import Link from "next/link";
import Image from "next/image";
import { EventDisplayData } from "@/types/event";

export default function CardDisplay({ event }: { event: EventDisplayData }) {
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
