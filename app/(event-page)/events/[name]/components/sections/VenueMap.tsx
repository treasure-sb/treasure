"use client";

import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SingleImageOverlay from "@/components/ui/custom/single-image-overlay";
import Image from "next/image";

export default function VenueMap({
  event,
  venueMapPublicUrl,
}: {
  event: Tables<"events">;
  venueMapPublicUrl: string;
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const eventHasVenueMap =
    event.venue_map_url && event.venue_map_url != "venue_map_coming_soon";

  const handleClose = () => {
    setShowOverlay(false);
  };

  return (
    eventHasVenueMap && (
      <>
        <Separator />
        <h3 className="font-semibold text-lg my-4 w-full">Venue Map</h3>
        <AspectRatio
          ratio={2 / 1}
          onClick={() => {
            setShowOverlay(true);
          }}
          className="relative group w-full md:w-[34rem]"
        >
          <Image
            className="rounded-xl object-cover"
            alt="venue map image"
            src={venueMapPublicUrl}
            layout="fill"
          />
        </AspectRatio>
        <AnimatePresence>
          {showOverlay && (
            <SingleImageOverlay
              photoSrc={venueMapPublicUrl}
              handleClose={handleClose}
            />
          )}
        </AnimatePresence>
      </>
    )
  );
}
