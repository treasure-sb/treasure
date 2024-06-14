"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EventHighlightPhoto } from "./PastHighlights";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import SingleImageOverlay from "@/components/ui/custom/single-image-overlay";

export default function ListHighlights({
  highlights,
}: {
  highlights: EventHighlightPhoto[];
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(highlights[0].publicUrl);

  const handleOpen = (picture: EventHighlightPhoto) => {
    setShowOverlay(true);
    setCurrentPhoto(picture.publicUrl);
  };

  const handleClose = () => {
    setShowOverlay(false);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {highlights.map((picture, index) => (
        <AspectRatio
          ratio={1 / 1}
          key={index}
          onClick={() => handleOpen(picture)}
          className="relative group"
        >
          <Image
            className="w-full h-full object-cover"
            layout="fill"
            src={picture.publicUrl}
            alt="event highlight image"
          />
        </AspectRatio>
      ))}
      <AnimatePresence>
        {showOverlay && (
          <SingleImageOverlay
            photoSrc={currentPhoto}
            handleClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
