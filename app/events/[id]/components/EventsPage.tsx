import Image from "next/image";
import { Tables } from "@/types/supabase";
import {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatStartTime,
  formatDate,
} from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/helpers/profiles";
import Link from "next/link";
import Tickets from "./Tickets";
import Tags from "./Tags";
import VendorTables from "./VendorTables";
import Vendors from "./Vendors";
import HostedBy from "./HostedBy";
import ColorThief from "./ColorThief";

export default async function EventsPage({
  event,
}: {
  event: Tables<"events">;
}) {
  const {
    data: { user },
  } = await validateUser();

  const [profile, publicPosterUrl, publicVenueMapUrl] = await Promise.all([
    getProfile(user?.id),
    getPublicPosterUrl(event),
    getPublicVenueMapUrl(event),
  ]);

  const formattedDate = formatDate(event.date);
  const formattedStartTime = formatStartTime(event.start_time);
  const organizer = event.organizer_id === user?.id ? true : false;
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
        <div className="relative lg:sticky lg:top-0 h-fit max-w-lg mx-auto lg:pt-8">
          <Image
            className="rounded-xl mb-6 lg:mb-0 m-auto"
            alt="event poster image"
            src={publicPosterUrl}
            width={500}
            height={500}
            priority
          />
          <ColorThief public_url={publicPosterUrl} />
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
          <div className="space-y-2">
            <Tickets event={event} />
            <VendorTables event={event} />
          </div>
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p className="leading-8">{event.description}</p>
          </div>
          <Separator />
          <Vendors event={event} />
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
            <p> {capitalize(event.address)}</p>
            <Link
              target="_blank"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.address
              )}`}
            >
              <Button
                className="rounded-full tracking-wide mt-4 w-60"
                variant={"secondary"}
              >
                OPEN IN MAPS
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {organizer || profile.role === "admin" ? (
        <div className="fixed right-6 bottom-6">
          <Link href={`/profile/events/organizer/${event.cleaned_name}`}>
            <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
              <svg
                width="70"
                height="70"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="60" cy="60" r="60" fill="#71D08C" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M81.7101 42.6872L77.3176 38.2953C76.3 37.2778 74.6347 37.2784 73.6171 38.2953L70.2591 41.6528L78.3521 49.7447L81.7101 46.3866C82.7284 45.3684 82.7259 43.7003 81.7126 42.6847L81.7101 42.6872ZM68.4688 43.4422L76.5619 51.5341L48.7934 79.2991L38.0024 81.9966L40.7003 71.2072L68.4688 43.4422ZM81.3038 38.7009L83.5004 40.8972L83.4979 40.8997C85.4376 42.7003 85.562 46.1153 83.5004 48.1766L50.338 81.3341L50.3367 81.3328C50.1798 81.4897 49.9804 81.6078 49.7498 81.6653L36.5828 84.9566C35.6508 85.1947 34.8069 84.3541 35.0388 83.4266L38.3168 70.3159C38.3631 70.0759 38.4787 69.8472 38.6644 69.6616L71.8268 36.5047C73.8334 34.4984 77.1013 34.4984 79.1079 36.5047L81.3038 38.7009Z"
                  fill="white"
                />
              </svg>
            </div>
          </Link>
        </div>
      ) : null}
    </main>
  );
}
