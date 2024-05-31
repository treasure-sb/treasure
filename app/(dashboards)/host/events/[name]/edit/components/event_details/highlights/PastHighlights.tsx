"use client";

import { Tables } from "@/types/supabase";
import { EventHighlightPhoto } from "../../../types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MoreVertical } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UploadHighlight from "./UploadHighlight";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SingleImageOverlay from "@/components/ui/custom/single-image-overlay";

export default function PastHighlights({
  event,
  previousHighlights,
}: {
  event: Tables<"events">;
  previousHighlights: EventHighlightPhoto[];
}) {
  const supabase = createClient();
  const { refresh } = useRouter();

  const [showOverlay, setShowOverlay] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(
    previousHighlights[0].publicUrl
  );

  const handleOpen = (picture: EventHighlightPhoto) => {
    setShowOverlay(true);
    setCurrentPhoto(picture.publicUrl);
  };

  const handleClose = () => {
    setShowOverlay(false);
  };

  const handleDelete = async (pictureUrl: string) => {
    toast.loading("Deleting image...");

    const { error: highlightError } = await supabase
      .from("event_highlights")
      .delete()
      .eq("picture_url", pictureUrl);

    const { error: storageError } = await supabase.storage
      .from("event_highlights")
      .remove([pictureUrl]);

    toast.dismiss();

    if (storageError || highlightError) {
      toast.error("Error deleting image");
      return;
    }

    toast.success("Image deleted");
    refresh();
  };

  return (
    <>
      <Separator />
      <h3 className="font-semibold text-lg mb-4">Edit Past Event Highlights</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {previousHighlights.map((picture, index) => (
          <AspectRatio
            onClick={() => handleOpen(picture)}
            ratio={1 / 1}
            key={index}
            className="relative group"
          >
            <Image
              className="w-full h-full object-cover"
              layout="fill"
              src={picture.publicUrl}
              alt="event highlight image"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="absolute top-4 right-4 text-foreground/60 group-hover:text-foreground transition duration-500 hover:cursor-pointer z-10" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-[-12px]">
                <Button
                  className="w-full rounded-md"
                  onClick={async () => await handleDelete(picture.photoUrl)}
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="absolute inset-0 rounded-md bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-500" />
          </AspectRatio>
        ))}
        <UploadHighlight event={event} />
        <AnimatePresence>
          {showOverlay && (
            <SingleImageOverlay
              photoSrc={currentPhoto}
              handleClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
