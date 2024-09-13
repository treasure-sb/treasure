"use client";
import Image from "next/image";
import LandingButton from "../LandingButton";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import { customLandingEase } from "../Free";

export default function Send() {
  const containerRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <div className="col-span-1 lg:col-span-2 h-full">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
        transition={{ duration: 1.75, ease: customLandingEase }}
        className="flex flex-col-reverse lg:flex-row bg-[#F8D57E] dark:bg-tertiary p-6 lg:p-10 rounded-3xl h-full"
      >
        <div className="flex flex-col justify-between lg:w-1/2 lg:pr-6 space-y-4">
          <p className="text-2xl font-semibold lg:text-4xl 2xl:text-[2.88rem] 2xl:leading-[1.3]">
            Map Your Vendors & Attractions
          </p>
          <div className="space-y-4">
            <p className="text-sm font-light lg:text-base 2xl:text-2xl">
              Create a custom map or upload your own. Assign vendors &
              attractions for easy attendee discovery.
            </p>
            <LandingButton
              className="bg-[#7DD9E8] hover:bg-[#7DD9E8]/90"
              href="/create"
              text="Create Your Event"
            />
          </div>
        </div>
        <div className="lg:w-1/2 flex-1 mb-10 lg:mb-0 flex items-center lg:items-end">
          <Image
            className="w-full h-auto object-contain ml-6 lg:ml-10"
            quality={100}
            priority
            src="/static/landing-page/grid/map.png"
            alt="hero image"
            width={600}
            height={600}
          />
        </div>
      </motion.div>
    </div>
  );
}
