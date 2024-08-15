"use client";
import { toast } from "sonner";
import { Link as Chain } from "lucide-react";

export default function CopyProfileLink({ username }: { username: string }) {
  const handleCopy = async () => {
    const naviagtorCopy = async () => {
      try {
        const inviteLink = `${window.location.origin}/u/${username}`;
        setTimeout(() => {
          navigator.clipboard.writeText(inviteLink);
        }, 0);
        toast("Profile Link Copied!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    await naviagtorCopy();
  };

  return (
    <div
      onClick={handleCopy}
      className="absolute bottom-1 left-1 w-11 h-11 p-2 rounded-full bg-foreground border-2 hover:cursor-pointer hover:bg-tertiary transition duration-500"
    >
      <Chain className="w-6 h-6 m-auto text-background" />
    </div>
  );
}
