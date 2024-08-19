"use client";
import Image from "next/image";
import LandingButton from "./LandingButton";
import { useEffect, useRef } from "react";
import { useAnimation, useInView, motion } from "framer-motion";
import { customLandingEase } from "./Free";

export default function LetsGetPeople() {
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
        <p className="text-2xl font-semibold lg:text-4xl 2xl:text-6xl">
          Let's Get People Out More
        </p>
        <div className="space-y-4">
          <p className="text-sm font-light lg:text-base 2xl:text-3xl mb-10">
            We grew up collecting cards, sneakers, and comic books. We love
            going to conventions but the logistics are not always easy. So we
            started Treasure to help more people get to shows and love the hobby{" "}
            <span className="text-primary">like we do.</span>
          </p>
          <div className="flex space-x-4">
            <LandingButton
              variant="tertiary"
              href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
              text="Get Started with Treasure"
            />
          </div>
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
          src="/static/landing-page/team_graphic.png"
          alt="attendees"
          width={600}
          height={600}
        />
      </motion.div>
    </div>
  );
}
