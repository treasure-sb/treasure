"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const MotionButton = motion(Button);
  const headingText = "More of the Shows & Conventions You Love";
  const heading = headingText.split(/(\s+)/).map((word, index) => {
    const isColored = word === "Shows" || word === "Conventions";
    const isSpace = word === " ";
    return (
      <motion.span key={index} className={isSpace ? "" : "inline-block"}>
        {isColored ? <span className="text-primary">{word}</span> : word}
      </motion.span>
    );
  });

  return (
    <section className="h-screen pt-10 md:pt-28 pb-[40vh] max-w-6xl m-auto flex items-end">
      <div className="flex flex-col space-y-10">
        <motion.p className="text-[2.4rem] font-extrabold text-left leading-[1.2] md:leading-[0.8] md:text-8xl md:max-w-6xl">
          {heading}
        </motion.p>
        {/* <Link href="/events" className="mt-10 w-fit">
          <MotionButton className="p-8 text-2xl font-semibold relative overflow-hidden hover:translate-x-4 hover:-translate-y-4 before:absolute before:inset-0 before:bg-white before:z-[-20] before:content-['']">
            Browse Events
          </MotionButton>
        </Link> */}
      </div>
    </section>
  );
}
