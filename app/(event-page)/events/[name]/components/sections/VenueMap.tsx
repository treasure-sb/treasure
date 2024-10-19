"use client";

import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SingleImageOverlay from "@/components/ui/custom/single-image-overlay";
import Image from "next/image";

export default function VenueMap({
  venueMap,
  venueMapPublicUrl,
}: {
  venueMap: string | null;
  venueMapPublicUrl: string | File | undefined;
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const eventHasVenueMap =
    (venueMap && venueMap != "venue_map_coming_soon") ||
    venueMapPublicUrl instanceof File;

  const handleClose = () => {
    setShowOverlay(false);
  };

  const venueMapImageSrc =
    typeof venueMapPublicUrl === "string"
      ? venueMapPublicUrl
      : venueMapPublicUrl instanceof File
      ? URL.createObjectURL(venueMapPublicUrl)
      : "";

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
            src={venueMapImageSrc}
            layout="fill"
          />
        </AspectRatio>
        <AnimatePresence>
          {showOverlay && (
            <SingleImageOverlay
              photoSrc={venueMapImageSrc}
              handleClose={handleClose}
            />
          )}
        </AnimatePresence>
      </>
    )
  );
}
