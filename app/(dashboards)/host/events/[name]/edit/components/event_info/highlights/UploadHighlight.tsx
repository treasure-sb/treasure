"use client";

import { CameraIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";

export default function UploadHighlight({
  event,
}: {
  event: Tables<"events">;
}) {
  const { refresh } = useRouter();
  const supabase = createClient();

  const handleUpload = async (file: File) => {
    toast.loading("Uploading image...");
    const fileExtension = file.name.split(".").pop();
    const uploadedFile = `highlight${Date.now()}.${fileExtension}`;
    const uploadedPath = `event-${event.id}/${uploadedFile}`;
    const { error: uploadError } = await supabase.storage
      .from("event_highlights")
      .upload(uploadedPath, file);

    const { error: insertError } = await supabase
      .from("event_highlights")
      .insert([{ event_id: event.id, picture_url: uploadedPath }]);

    toast.dismiss();

    if (insertError || uploadError) {
      toast.error("Error uploading image");
      return;
    }

    toast.success("Image uploaded!");
    refresh();
  };

  return (
    <AspectRatio ratio={1 / 1} className="hover:cursor-pointer">
      <Label htmlFor="upload">
        <AspectRatio
          ratio={1 / 1}
          className="bg-slate-500/5 flex items-center justify-center group hover:cursor-pointer hover:bg-slate-400/5 transition duration-500"
        >
          <div className="flex items-center justify-center w-full absolute">
            <CameraIcon
              size={30}
              className="text-foreground/60 group-hover:text-foreground transition duration-500 block md:hidden stroke-1"
            />
            <CameraIcon
              size={40}
              className="text-foreground/60 group-hover:text-foreground transition duration-500 hidden md:block stroke-1"
            />
          </div>
        </AspectRatio>
      </Label>
      <Input
        id="upload"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            if (!file.type.startsWith("image/")) {
              toast.error("Please upload an image file.");
              return;
            }
            await handleUpload(file);
          }
        }}
        className="rounded-md w-full hidden"
      />
    </AspectRatio>
  );
}
