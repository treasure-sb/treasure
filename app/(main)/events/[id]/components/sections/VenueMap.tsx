import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { getPublicVenueMapUrl } from "@/lib/helpers/events";
import Image from "next/image";

export default async function VenueMap({ event }: { event: Tables<"events"> }) {
  const publicVenueMapUrl = await getPublicVenueMapUrl(event);
  const eventHasVenueMap =
    event.venue_map_url && event.venue_map_url != "venue_map_coming_soon";
  return (
    eventHasVenueMap && (
      <>
        <Separator />
        <div className="font-semibold text-2xl my-4 w-full">Venue Map</div>
        <Image
          className="rounded-xl mb-6 lg:mb-0"
          alt="venue map image"
          src={publicVenueMapUrl}
          width={500}
          height={200}
        />
      </>
    )
  );
}
