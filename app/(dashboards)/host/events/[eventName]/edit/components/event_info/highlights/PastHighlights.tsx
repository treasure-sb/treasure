"use client";

import { Tables } from "@/types/supabase";
import { EventHighlightPhotos } from "../../../types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MoreVertical } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import UploadHighlight from "./UploadHighlight";

export default function PastHightlights({
  event,
  previousHighlights,
}: {
  event: Tables<"events">;
  previousHighlights: EventHighlightPhotos[];
}) {
  const supabase = createClient();
  const { refresh } = useRouter();

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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {previousHighlights.map((picture, index) => (
        <AspectRatio ratio={1 / 1} key={index} className="relative group">
          <Image
            className="w-full h-full rounded-md object-cover"
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
    </div>
  );
}
