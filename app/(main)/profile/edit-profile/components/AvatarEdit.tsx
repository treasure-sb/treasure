"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AvatarEdit({
  avatarUrl,
  setAvatarFile,
}: {
  avatarUrl?: string | undefined;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
}) {
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null);

  return (
    <div className="relative flex justify-center flex-grow">
      <label
        className="relative w-fit h-fit hover:cursor-pointer rounded-full group"
        htmlFor="avatar"
      >
        {avatarUrl || avatarFileUrl ? (
          <Avatar className="h-32 w-32 m-auto">
            <AvatarImage src={avatarFileUrl || avatarUrl} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-32 w-32 m-auto rounded-full bg-secondary" />
        )}
        <div className="absolute bottom-1 right-1 border-2 border-background rounded-full bg-foreground p-1 w-8 h-8 flex items-center justify-center group-hover:bg-gray-400 duration-300 transition">
          <Edit2Icon size={18} className="text-background" />
        </div>
      </label>
      <Input
        name="avatar"
        id="avatar"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            setAvatarFileUrl(URL.createObjectURL(file));
            setAvatarFile(file);
          }
        }}
      />
    </div>
  );
}
