"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useViewportSize } from "@mantine/hooks";
import Image from "next/image";
import LandingButton from "../LandingButton";
import HeroGradient from "./HeroGradient";
import { useState } from "react";

export default function Hero() {
  const { width } = useViewportSize();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="max-w-[var(--container-width)] mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="flex flex-col justify-between items-center mx-auto min-h-screen lg:h-[80vh] lg:min-h-0 lg:flex-row-reverse lg:items-stretch w-full">
        <div className="relative w-full md:w-3/4 lg:w-1/2 h-96 md:h-[550px] lg:h-auto flex justify-center lg:justify-end items-center mx-auto">
          <AnimatePresence>
            {imageLoaded && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center w-full h-full"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: width < 1700 ? 1.05 : 1.35 }}
                transition={{ duration: 1.75, ease: "easeOut" }}
              >
                <HeroGradient className="w-full h-full" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="z-10 w-full h-full flex items-center justify-center">
            <Image
              className="object-contain w-full max-w-full max-h-full md:max-w-2xl lg:max-w-3xl"
              priority
              src="/static/landing-page/hero/hero.png"
              alt="hero"
              width={600}
              height={600}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 lg:space-y-12 mb-14 lg:mb-0 lg:pr-8 mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-5xl lg:text-6xl 2xl:text-[5.25rem] font-semibold text-left 2xl:leading-[1.05]">
            Find More Hobby Events You Love{" "}
            <span className="text-[#2AAA88] dark:text-primary">
              Every Weekend
            </span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-light text-left">
            Join the #1 community for card shows and hobby events.
            <br className="hidden sm:block" />
            We make getting tickets and tables easy.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <LandingButton
              href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
              text="Get Started Now"
            />
            <LandingButton
              href="/events"
              text="Browse Events"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
