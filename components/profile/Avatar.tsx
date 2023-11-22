"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function Avatar({ id }: { id: string }) {
  "use client";
  const [avatarUrl, setAvatarUrl] = useState<File | null>(null);
  const [addAvatar, setAddAvatar] = useState(false);

  const onUpload = async () => {
    if (!avatarUrl) return;
    const supabase = createClient();
    const avatarStorageUrl = `avatar${Date.now()}.png`;

    // upload avatar to storage
    try {
      await supabase.storage
        .from("avatars")
        .upload(avatarStorageUrl, avatarUrl);
    } catch (err) {
      console.log(err);
    }

    // update avatar_url in profiles table
    try {
      await supabase
        .from("profiles")
        .update({ avatar_url: avatarStorageUrl })
        .eq("id", id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="relative flex justify-center">
      <label
        className="hover:cursor-pointer w-28 h-28 rounded-full"
        htmlFor="avatar"
      >
        {avatarUrl ? (
          <img
            src={URL.createObjectURL(avatarUrl)}
            className="w-28 h-28 rounded-full"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-slate-200"></div>
        )}
      </label>
      <input
        name="avatar"
        id="avatar"
        type="file"
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;
          setAddAvatar(true);
          if (file) {
            setAvatarUrl(file);
          }
        }}
        className="w-24 hidden"
      ></input>
      {addAvatar && (
        <Button
          onClick={onUpload}
          className="absolute bottom-0 right-0"
          variant={"secondary"}
          type="submit"
        >
          Upload
        </Button>
      )}
    </form>
  );
}
