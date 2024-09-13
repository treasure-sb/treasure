"use client";
import Image from "next/image";
import LandingButton from "./LandingButton";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import { customLandingEase } from "./Free";

export default function AllYourAttendees() {
  const imageRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(imageRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <div className="flex flex-col-reverse lg:col-span-2 lg:flex-row lg:justify-between">
      <div className="flex flex-col justify-between lg:justify-center lg:w-1/2 lg:pr-20 space-y-4 lg:space-y-20">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl 2xl:leading-snug">
          All Your Attendees & Vendors in One Place
        </p>
        <p className="text-sm font-light 2xl:text-3xl pb-4 lg:pb-0">
          Send invites and event updates to re-engage customers directly from
          your dashboard. Create custom groups by event category & attendance.
        </p>
        <div className="flex space-x-4">
          <LandingButton href="/create" text="Create Your Event" />
          <LandingButton
            href="/events"
            text="Browse Events"
            variant={"outline"}
          />
        </div>
      </div>
      <motion.div
        ref={imageRef}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        transition={{ duration: 1.25, ease: customLandingEase }}
        className="w-full h-auto md:w-[60%] lg:w-1/2 2xl:w-[38rem] mb-10 md:ml-auto"
      >
        <Image
          className="w-full h-full rounded-3xl object-contain"
          quality={100}
          priority
          src="/static/landing-page/attendees.png"
          alt="attendees"
          width={600}
          height={600}
        />
      </motion.div>
    </div>
  );
}
