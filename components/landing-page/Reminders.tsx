"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Reminders() {
  const [isChildInView, setIsChildInView] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: isChildInView ? 1 : 0,
        y: isChildInView ? 0 : 10,
      }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      className="mt-40 md:mt-60 w-full flex flex-col md:flex-row md:space-x-12 md:items-center md:justify-between"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ ease: "easeInOut", repeat: Infinity, duration: 6 }}
        className="relative mb-8 md:mb-0"
      >
        <Image
          className="w-[80%] md:w-full m-auto rotate-0 md:rotate-2"
          alt="preview celebrites, vendors, guests, and more"
          src={"/static/phone_text.png"}
          width={400}
          height={1400}
          quality={100}
        />
        <motion.div
          className="absolute bottom-3/4"
          onViewportEnter={() => setIsChildInView(true)}
        />
        <div className="hidden md:block md:absolute inset-0 z-[-10] w-full h-full blur-3xl opacity-20 bg-foreground" />
      </motion.div>
      <div className="space-y-8">
        <div className="max-w-2xl">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-3xl text-left md:text-right font-semibold">
              Send <i>Free</i> Reminders & Post-Event Messages
            </h1>
            <p className="text-left md:text-right text-xl">
              Enhance attendee engagement and follow-up effortlessly with
              reminders and post-event communications.
            </p>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Link href="login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}