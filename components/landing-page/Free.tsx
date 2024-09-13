"use client";

import Image from "next/image";
import LandingButton from "./LandingButton";
import { motion, useInView, useAnimation, cubicBezier } from "framer-motion";
import { useRef, useEffect } from "react";

export const customLandingEase = cubicBezier(0.4, -0.05, 0.01, 0.99);

export default function Free() {
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
      <div className="flex flex-col justify-between lg:w-1/2 lg:pr-20 lg:justify-center lg:space-y-20 space-y-4">
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl 2xl:leading-snug">
          Free for Event Organizers,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C9B677] to-[#67581E]">
            Forever
          </span>
        </p>
        <p className="text-sm font-light 2xl:text-3xl pb-4 lg:pb-0">
          The #1 way to sell your tickets and vendor tables online. No fee on
          any sale for organizers. Launch your event in under 5 minutes.
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
          src="/static/landing-page/free.png"
          alt="attendees"
          width={600}
          height={600}
        />
      </motion.div>
    </div>
  );
}
