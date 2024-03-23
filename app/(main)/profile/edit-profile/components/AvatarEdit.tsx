"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Edit2Icon } from "lucide-react";

export default function AvatarEdit({
  avatarUrl,
  setAvatarFile,
}: {
  avatarUrl?: string | undefined;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
}) {
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null);

  return (
    <form className="relative flex justify-center md:justify-end flex-grow">
      <label
        className="relative w-fit h-fit hover:cursor-pointer rounded-full group"
        htmlFor="avatar"
      >
        {avatarUrl || avatarFileUrl ? (
          <Avatar className="h-40 w-40 md:w-60 md:h-60 m-auto">
            <AvatarImage src={avatarFileUrl || avatarUrl} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-32 w-32 m-auto rounded-full bg-gray-200" />
        )}
        <div className="absolute bottom-0 right-0 border-2 border-background rounded-full bg-foreground p-2 md:p-4 group-hover:bg-tertiary transition duration-500">
          <Edit2Icon className="text-background" />
        </div>
      </label>
      <input
        name="avatar"
        id="avatar"
        type="file"
        className="w-24 hidden"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            setAvatarFileUrl(URL.createObjectURL(file));
            setAvatarFile(file);
          }
        }}
      ></input>
    </form>
  );
}
