"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import EditPencilIcon from "@/components/icons/EditPencilIcon";

export default function AvatarEdit({
  avatarUrl,
  setAvatarFile,
}: {
  avatarUrl?: string | undefined;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
}) {
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null);

  return (
    <form className="relative flex justify-center">
      <label
        className="relative hover:cursor-pointer w-28 h-28 rounded-full"
        htmlFor="avatar"
      >
        {avatarUrl || avatarFileUrl ? (
          <Avatar className="h-32 w-32 m-auto">
            <AvatarImage src={avatarFileUrl || avatarUrl} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-32 w-32 m-auto rounded-full bg-gray-200" />
        )}
        <EditPencilIcon className="absolute bottom-[-10px] right-[-10px]" />
      </label>
      <input
        name="avatar"
        id="avatar"
        type="file"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            setAvatarFileUrl(URL.createObjectURL(file));
            setAvatarFile(file);
          }
        }}
        className="w-24 hidden"
      ></input>
    </form>
  );
}
