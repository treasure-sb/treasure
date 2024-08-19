"use client";
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
      controls.start({ opacity: 1, x: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: -30 }}
      animate={controls}
      transition={{ duration: 1.75, ease: customLandingEase }}
      className="col-span-1 bg-[#ACF2D6] dark:bg-green-600 p-6 lg:p-10 rounded-2xl flex flex-col justify-between "
    >
      <p className="text-2xl font-semibold lg:text-4xl 2xl:text-[2.88rem] 2xl:leading-[1.3]">
        Send Unlimited Free Texts & Emails
      </p>
      <div className="flex flex-row my-8">
        <div className="bg-gray-900 border-2 border-slate-300 p-4 rounded-2xl text-sm text-muted-foreground">
          <p>Our show is coming up in one week!</p>
          <br />
          <p>Here are the set-up instructions when you arrive:</p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm lg:text-base 2xl:text-2xl font-light">
          Most emails don’t get opened. Send texts with emails to best re-engage
          customers.
        </p>
        <LandingButton
          href="https://app.formbricks.com/s/clz90def600006xxfp1ewje9i"
          text="Create Your Event"
        />
      </div>
    </motion.div>
  );
}
