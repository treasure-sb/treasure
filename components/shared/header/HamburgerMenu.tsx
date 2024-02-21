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
import ArrowPointingRight from "@/components/icons/ArrowPointingRight";
import Link from "next/link";

export default function HamburgerMenu({
  profile,
  profilePublicUrl,
}: {
  profile: Tables<"profiles">;
  profilePublicUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const animationVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="block md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <MenuIcon
            className="stroke-1"
            onClick={() => setOpen(true)}
            size={38}
          />
        </SheetTrigger>
        <SheetContent className="pt-16">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
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
                  <Avatar className="h-20 w-20 border-primary border-2">
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
            <motion.div
              variants={animationVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.35, duration: 0.4 }}
              onClick={() => setOpen(false)}
              className="group"
            >
              <Link
                href="/events"
                className="text-xl flex justify-between items-center"
              >
                <p>Events</p>
                <ArrowPointingRight className="group-hover:translate-x-1 transition duration-300 text-2xl" />
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
                className="text-xl flex justify-between items-center"
              >
                <p>Profile Settings</p>
                <ArrowPointingRight className="group-hover:translate-x-1 transition duration-300 text-2xl" />
              </Link>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
