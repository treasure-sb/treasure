import Link from "next/link";
import * as React from "react";
import TreasureEmerald from "../../icons/TreasureEmerald";
import HamburgerMenu from "./HamburgerMenu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/helpers/profiles";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function LoggedInHeader({ user }: { user: User | null }) {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user?.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  return (
    <header className="flex justify-between items-center md:max-w-6xl xl:max-w-7xl m-auto w-full mb-10 z-10">
      <div className="relative">
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center space-x-1"
        >
          <TreasureEmerald width={34} height={34} />
          <h1>Treasure</h1>
        </Link>
        {profile.role === "admin" && (
          <p className="text-primary font-bold absolute bottom-[-18px] right-[-26px]">
            admin
          </p>
        )}
      </div>
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/events"
          className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
        >
          Events
        </Link>

        <Popover>
          <PopoverTrigger>
            <Avatar className="h-16 w-16 border-primary">
              <AvatarImage src={publicUrl} />
              <AvatarFallback>
                {profile.first_name[0]}
                {profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex flex-col bg-black mt-4 px-0 py-2 overflow-hidden"
          >
            <Link
              className="hover:text-primary hover:bg-gray-500 hover:bg-opacity-20 px-4 py-2"
              href="/profile/tickets"
            >
              Tickets
            </Link>
            <Link
              className="hover:text-primary hover:bg-gray-500 hover:bg-opacity-20 px-4 py-2"
              href={`/${profile.username}`}
            >
              View Profile
            </Link>
            <Link
              className="hover:text-primary hover:bg-gray-500 hover:bg-opacity-20 px-4 py-2"
              href="/profile"
            >
              Manage Profile
            </Link>
            <Link
              className="hover:text-primary hover:bg-gray-500 hover:bg-opacity-20 px-4 py-2"
              href="/host/events"
            >
              Host Dashboard
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <HamburgerMenu profile={profile} profilePublicUrl={publicUrl} />
    </header>
  );
}
