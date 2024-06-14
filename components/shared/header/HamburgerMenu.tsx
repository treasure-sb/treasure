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
import { MenuIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  CalendarSearch,
  TicketIcon,
  User2Icon,
  Settings,
  LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";

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
  const animationVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="block md:hidden ml-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon
            className="stroke-1 hover:cursor-pointer"
            onClick={() => setOpen(true)}
            size={38}
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
                <Link href={`/${profile.username}`} className="rounded-full">
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
              <motion.div
                variants={animationVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4, duration: 0.4 }}
                onClick={() => setOpen(false)}
                className="group"
              >
                <Link
                  href="/events"
                  className="text-xl flex items-center space-x-3"
                >
                  <CalendarSearch />
                  <p>Events</p>
                </Link>
              </motion.div>
            )}
            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="group"
            >
              <Link
                href="/profile/tickets"
                className="text-xl flex items-center space-x-3"
              >
                <TicketIcon />
                <p>Tickets</p>
              </Link>
            </motion.div>
            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="group"
            >
              <Link
                href={`/${profile.username}`}
                className="text-xl flex items-center space-x-3"
              >
                <User2Icon />
                <p>View Profile</p>
              </Link>
            </motion.div>
            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="group"
            >
              <Link
                href="/profile"
                className="text-xl flex items-center space-x-3"
              >
                <Settings />
                <p>Manage Profile</p>
              </Link>
            </motion.div>

            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="group"
            >
              <Link
                href="/host/events"
                className="text-xl flex items-center space-x-3"
              >
                <LayoutDashboardIcon />
                <p>Host Dashboard</p>
              </Link>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
