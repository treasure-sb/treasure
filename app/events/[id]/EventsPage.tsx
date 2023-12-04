import Image from "next/image";
import { Tables } from "@/types/supabase";
import {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  formatDate,
} from "@/utils/helpers/events";
import Link from "next/link";
import Tickets from "./Tickets";
import { Separator } from "@/components/ui/separator";
import Tags from "./Tags";
import Vendors from "./Vendors";
import HostedBy from "./HostedBy";

export default async function EventsPage({
  event,
}: {
  event: Tables<"events">;
}) {
  const publicPosterUrl = await getPublicPosterUrl(event);
  const publicVenueMapUrl = await getPublicVenueMapUrl(event);
  const formattedDate = formatDate(event.date);
  const formattedStartTime = formatStartTime(event.start_time);

  const capitalize = (address: string) => {
    const words = address.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  return (
    <main className="w-full lg:w-fit m-auto">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <div className="lg:max-w-lg">
          <Image
            className="rounded-xl mb-6 lg:mb-0 m-auto lg:sticky lg:top-10"
            alt="event poster image"
            src={publicPosterUrl}
            width={500}
            height={500}
          />
        </div>
        <div className="flex flex-col text-left max-w-lg lg:max-w-xl mx-auto space-y-8">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1 className="font-semibold">{event.venue_name}</h1>
            <h1 className="text-tertiary">
              {formattedDate} at {formattedStartTime}
            </h1>
          </div>
          <Tags event={event} />
          <Tickets event={event} />
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p>{event.description}</p>
          </div>
          <Separator />
          <Vendors event={event} />
          <Separator />
          <HostedBy event={event} />
          <Separator />
          {event.venue_map_url ? (
            <>
              <div className="font-semibold text-2xl my-4 w-full">
                Venue Map
              </div>
              <Image
                className="rounded-xl mb-6 lg:mb-0"
                alt="venue map image"
                src={publicVenueMapUrl}
                width={500}
                height={200}
              />
            </>
          ) : null}
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">Location</h1>
            <Link
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.address
              )}`}
            >
              {capitalize(event.address)}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
