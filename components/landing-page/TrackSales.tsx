"use client";
import Image from "next/image";
import LandingButton from "./LandingButton";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import { customLandingEase } from "./Free";

export default function TrackSales() {
  const imageRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(imageRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <div className="relative mx-[-16px] sm:mx-[-32px] py-16 overflow-hidden dark:text-background">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8E1BB] to-[#97DFFF]"></div>
      <div className="relative max-w-[var(--container-width)] m-auto flex flex-col lg:flex-row lg:justify-between p-6 px-4 lg:p-10">
        <motion.div
          ref={imageRef}
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ duration: 1.25, ease: customLandingEase }}
          className="w-full h-auto md:w-[60%] lg:w-1/2 2xl:w-[38rem] mb-10"
        >
          <Image
            className="w-full h-full rounded-3xl object-contain"
            quality={100}
            priority
            src="/static/landing-page/dashboard.png"
            alt="attendees"
            width={600}
            height={600}
          />
        </motion.div>
        <div className="flex flex-col justify-between lg:justify-center items-start md:items-end lg:items-start lg:w-1/2 lg:pl-20 space-y-4 lg:space-y-20">
          <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl text-left 2xl:text-right 2xl:leading-snug">
            Track Sales & Get Paid Daily
          </p>
          <p className="text-sm font-light md:text-right lg:text-left lg:text-base 2xl:text-3xl mb-10 2xl:text-right pb-4 lg:pb-0">
            Sell tickets and charge vendors the moment you start promoting your
            event. Get access to more funds well in advance.
          </p>
          <div className="flex space-x-4 justify-start md:justify-end lg:justify-start 2xl:justify-end w-full">
            <LandingButton
              variant="tertiary"
              href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
              text="Create Your Event"
            />
            <LandingButton
              className="dark:bg-transparent dark:border-background darK:hover:text-background"
              href="/events"
              text="Browse Events"
              variant={"outline"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
