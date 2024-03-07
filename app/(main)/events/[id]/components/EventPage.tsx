import Image from "next/image";
import {
  getPublicPosterUrl,
  getPublicVenueMapUrl,
  formatDate,
  getEventDisplayData,
} from "@/lib/helpers/events";
import { convertToStandardTime } from "@/lib/utils";
import { validateUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/helpers/profiles";
import EventPoster from "@/components/events/shared/EventPoster";
import Link from "next/link";
import Tickets from "./tickets/Tickets";
import Tags from "./Tags";
import VendorTables from "./tables/VendorTables";
import HostedBy from "./HostedBy";
import ColorThief from "@/components/events/shared/ColorThief";
import EditEvent from "@/components/icons/EditEvent";
import LikeButton from "@/components/events/shared/LikeButton";
import Vendors from "./Vendors";
import AdminOptions from "./admin/AdminOptions";

export interface EventDisplayInformation {
  publicPosterUrl: string;
  formattedStartTime: string;
  formattedEndTime: string;
  venueName: string;
}

export default async function EventPage({ event }: { event: any }) {
  const {
    data: { user },
  } = await validateUser();

  const [{ profile }, publicPosterUrl, publicVenueMapUrl] = await Promise.all([
    getProfile(user?.id),
    getPublicPosterUrl(event),
    getPublicVenueMapUrl(event),
  ]);

  const formattedDate = formatDate(event.date);
  const formattedStartTime = convertToStandardTime(event.start_time);
  const formattedEndTime = convertToStandardTime(event.end_time);
  const organizer = event.organizer_id === user?.id ? true : false;
  const capitalize = (address: string) => {
    const words = address.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  };

  const eventDisplayInfo = {
    publicPosterUrl,
    formattedStartTime,
    formattedEndTime,
    venueName: event.venue_name,
  };

  const eventDisplayData = await getEventDisplayData(event);

  return (
    <main className="w-full md:w-fit m-auto">
      <div className="mt-10 flex flex-col lg:flex-row lg:space-x-10">
        <div className="relative lg:sticky lg:top-0 h-fit max-w-lg mx-auto lg:pt-8">
          <div className="absolute right-2 top-2 lg:top-10 p-2 z-10 bg-black rounded-full hover:bg-black">
            <LikeButton event={event} user={user} />
          </div>
          <div className="mb-6">
            <EventPoster posterUrl={publicPosterUrl} />
          </div>
          <ColorThief publicUrl={publicPosterUrl} />
        </div>
        <div className="flex flex-col text-left max-w-lg lg:max-w-xl mx-auto space-y-8 z-10">
          <h1 className="text-4xl font-semibold">{event.name}</h1>
          <div>
            <h1 className="font-semibold">{event.venue_name}</h1>
            <h1 className="text-tertiary">
              {formattedDate} at {formattedStartTime} - {formattedEndTime}
            </h1>
          </div>
          <Tags event={event} />
          <div className="space-y-2">
            <Tickets
              event={event}
              user={user}
              eventDisplayData={eventDisplayData}
            />
            <VendorTables event={event} />
          </div>
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">About</h1>
            <p className="leading-8">{event.description}</p>
          </div>
          <Separator />
          <div>
            <h1 className="font-semibold text-2xl">Location</h1>
            <p>{capitalize(event.address)}</p>
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
          <Separator />
          <Vendors event={event} />
          <HostedBy event={event} />
          {event.venue_map_url &&
            event.venue_map_url != "venue_map_coming_soon" && (
              <>
                <Separator />
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
            )}
        </div>
      </div>
      <div className="fixed right-6 bottom-6 flex flex-col space-y-4 items-end z-20">
        {profile && profile.role === "admin" && <AdminOptions event={event} />}
        {(organizer || (profile && profile.role === "admin")) && (
          <Link href={`/profile/events/organizer/${event.cleaned_name}`}>
            <div className="opacity-80 sm:opacity-60 hover:opacity-100 transition duration-300">
              <EditEvent />
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
