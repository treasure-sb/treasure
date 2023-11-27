"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

export default function AvatarEdit({
  avatarUrl,
  setAvatarFile,
}: {
  avatarUrl: string | null;
  setAvatarFile: Dispatch<SetStateAction<File | null>>;
}) {
  const [avatarFileUrl, setAvatarFileUrl] = useState<string | null>(null);

  return (
    <form className="relative flex justify-center">
      <label
        className="hover:cursor-pointer w-28 h-28 rounded-full"
        htmlFor="avatar"
      >
        {avatarUrl ? (
          <div className="h-28 w-28 rounded-full overflow-hidden">
            <Image
              className="block w-full h-full object-cover"
              alt="avatar"
              src={avatarFileUrl ? avatarFileUrl : avatarUrl}
              width={100}
              height={100}
            />
          </div>
        ) : null}
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
