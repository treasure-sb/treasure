import Link from "next/link";
import * as React from "react";
import HamburgerMenu from "./HamburgerMenu";
import createSupabaseServerClient from "@/utils/supabase/server";
import HeaderMotion from "./HeaderMotion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { getProfile } from "@/lib/helpers/profiles";
import {
  TicketIcon,
  User2Icon,
  Settings,
  LayoutDashboardIcon,
} from "lucide-react";
import Image from "next/image";
import HeaderStatic from "./HeaderStatic";
import Logo from "@/components/icons/logo";

export default async function LoggedInHeader({
  user,
  useMotion = true,
  isEventPage = false,
}: {
  user: User;
  useMotion?: boolean;
  isEventPage?: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(user.id);
  const {
    data: { publicUrl },
  } = await supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);

  const Header = useMotion ? HeaderMotion : HeaderStatic;

  return (
    <Header>
      {!isEventPage && (
        <div className="relative">
          <Link
            href="/home"
            className="font-bold text-3xl flex items-center justify-start space-x-1"
          >
            <Logo />
          </Link>
          {profile.role === "admin" && (
            <p className="text-primary font-bold absolute bottom-[-18px] right-[-26px] mb-2">
              admin
            </p>
          )}
        </div>
      )}
      <div className="hidden md:flex items-center space-x-6 ml-auto">
        {!isEventPage && (
          <Link
            href="/events"
            className="hover:text-foreground/80 transition duration-300 text-lg font-semibold"
          >
            Events
          </Link>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="h-14 w-14 border-primary hover:cursor-pointer">
              <AvatarImage src={publicUrl} />
              <AvatarFallback>
                {profile.first_name[0]}
                {profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="flex flex-col bg-black mt-4 p-2 overflow-hidden"
          >
            <Link
              className="hover:text-primary duration-300 transition px-4 py-2 flex space-x-2"
              href="/profile/tickets"
            >
              <TicketIcon className="stroke-1" />
              <p>Tickets</p>
            </Link>
            <Link
              className="hover:text-primary duration-300 transition px-4 py-2 flex space-x-2"
              href={`/${profile.username}`}
            >
              <User2Icon className="stroke-1" />
              <p>Profile</p>
            </Link>
            <Link
              className="hover:text-primary duration-300 transition px-4 py-2 flex space-x-2"
              href="/profile"
            >
              <Settings className="stroke-1" />
              <p>Settings</p>
            </Link>
            <Link
              className="hover:text-primary duration-300 transition px-4 py-2 flex space-x-2"
              href="/host/events"
            >
              <LayoutDashboardIcon className="stroke-1" />
              <p>Host Dashboard</p>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <HamburgerMenu
        profile={profile}
        profilePublicUrl={publicUrl}
        isEventPage={isEventPage}
      />
    </Header>
  );
}
