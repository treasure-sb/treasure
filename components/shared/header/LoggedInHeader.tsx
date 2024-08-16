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
  LucideIcon,
} from "lucide-react";
import HeaderStatic from "./HeaderStatic";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import { ThemeSwitch } from "./ThemeSwitch";

type PopoverLinkProps = {
  href: string;
  text: string;
  Icon: LucideIcon;
};

const PopoverLink = ({ href, text, Icon }: PopoverLinkProps) => (
  <Link
    className="hover:text-primary duration-300 transition px-4 py-2 flex space-x-2"
    href={href}
  >
    <Icon className="stroke-1" />
    <p>{text}</p>
  </Link>
);

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

  const popoverLinks = [
    { href: "/profile/tickets", text: "Tickets", Icon: TicketIcon },
    { href: `/u/${profile.username}`, text: "Profile", Icon: User2Icon },
    { href: "/profile", text: "Settings", Icon: Settings },
    { href: "/host", text: "Host Dashboard", Icon: LayoutDashboardIcon },
  ];

  return (
    <Header>
      {!isEventPage && (
        <div className="relative">
          <Link
            href="/home"
            className="font-bold text-3xl flex items-center justify-start space-x-1"
          >
            <div className="flex space-x-1 items-center font-bold">
              <TreasureEmerald width={28} height={28} />
              <p>Treasure</p>
            </div>
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
            className="flex flex-col bg-slate-100 dark:bg-black mt-4 p-2 overflow-hidden"
          >
            {popoverLinks.map(({ href, text, Icon }) => (
              <PopoverLink key={text} href={href} text={text} Icon={Icon} />
            ))}
            <div className="px-4 py-2">
              <ThemeSwitch />
            </div>
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
