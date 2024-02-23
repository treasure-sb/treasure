"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const headingText = "Get to More of the Shows & Conventions You Love";
  const heading = headingText.split(/(\s+)/).map((word, index) => {
    const isColoredGreen = word === "Shows" || word === "Conventions";
    const isSpace = word === " ";
    return (
      <motion.span key={index} className={isSpace ? "" : "inline-block"}>
        {isColoredGreen ? <span className="text-primary">{word}</span> : word}
      </motion.span>
    );
  });

  const subheadingText =
    "Discover events tailored to you and book tickets or tables in seconds.";

  const subheading = subheadingText.split(/(\s+)/).map((word, index) => {
    const isSpace = word === " ";
    return (
      <motion.span key={index} className={isSpace ? "" : "inline-block"}>
        {word}
      </motion.span>
    );
  });

  return (
    <section className="h-screen pt-10 md:pt-28 w-full before:z-0 before:bg-[radial-gradient(circle_farthest-side_at_calc(100px)_calc(100px),_var(--primary-hero)_0%,_transparent_100%)] before:pointer-events-none before:inset-0 before:fixed before:opacity-0">
      <div>
        <div className="relative z-10">
          <motion.p className="z-10 relative max-w-6xl text-[2.4rem] font-bold text-center m-auto leading-[1.2] md:leading-[1.3] md:text-7xl md:max-w-4xl">
            {heading}
          </motion.p>
          <p className="text-center text-md md:text-lg my-4">{subheading}</p>
          <div className="w-full flex justify-center items-center">
            <Link className="mt-2 md:mt-6" href="/events">
              <Button className="rounded-full" asChild>
                <motion.button className="text-black w-40 md:w-52 md:py-8 md:text-xl block font-semibold rounded-full">
                  Browse Events
                </motion.button>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
