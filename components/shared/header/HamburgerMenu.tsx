"use client";

import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LucideIcon, MenuIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  CalendarSearch,
  TicketIcon,
  User2Icon,
  Settings,
  LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "../ThemeSwitch";

type SheetLinkProps = {
  href: string;
  text: string;
  Icon: LucideIcon;
  handleOpen: () => void;
};

const animationVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const SheetLink = ({ href, text, Icon, handleOpen }: SheetLinkProps) => {
  return (
    <motion.div
      variants={animationVariants}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.4, duration: 0.4 }}
      onClick={handleOpen}
      className="group"
    >
      <Link href={href} className="text-xl flex items-center space-x-3">
        <Icon />
        <p>{text}</p>
      </Link>
    </motion.div>
  );
};

export default function HamburgerMenu({
  profile,
  profilePublicUrl,
  isEventPage = false,
}: {
  profile: Tables<"profiles">;
  profilePublicUrl: string;
  isEventPage?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(false);

  const sheetLinks = [
    { href: "/profile/tickets", text: "Tickets", Icon: TicketIcon, handleOpen },
    {
      href: `/u/${profile.username}`,
      text: "Profile",
      Icon: User2Icon,
      handleOpen,
    },
    { href: "/profile", text: "Settings", Icon: Settings, handleOpen },
    {
      href: "/host",
      text: "Host Dashboard",
      Icon: LayoutDashboardIcon,
      handleOpen,
    },
  ];

  return (
    <div className="block md:hidden ml-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon
            className="stroke-1 hover:cursor-pointer"
            onClick={() => setOpen(true)}
            size={30}
          />
        </SheetTrigger>
        <SheetContent className="pt-16">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center space-x-4">
              <motion.p
                variants={animationVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-left mb-2 text-2xl"
              >
                Hey, {profile.first_name}
              </motion.p>
              <motion.div
                className="w-fit"
                variants={animationVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={() => setOpen(false)}
              >
                <Link href={`/u/${profile.username}`} className="rounded-full">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profilePublicUrl} />
                    <AvatarFallback>
                      {profile.first_name[0]}
                      {profile.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </motion.div>
            </SheetTitle>
          </SheetHeader>
          <motion.div
            variants={animationVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Separator className="my-10" />
          </motion.div>
          <div className="flex flex-col space-y-8 w-full">
            {!isEventPage && (
              <SheetLink
                href="/events"
                text="Events"
                handleOpen={handleOpen}
                Icon={CalendarSearch}
              />
            )}
            {sheetLinks.map(({ href, text, Icon, handleOpen }) => (
              <SheetLink
                key={text}
                href={href}
                text={text}
                Icon={Icon}
                handleOpen={handleOpen}
              />
            ))}
            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <ThemeSwitch />
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
