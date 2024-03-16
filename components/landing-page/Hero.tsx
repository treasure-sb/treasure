"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

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
    <section className="h-screen relative mx-[-16px] flex items-end mt-[-100px] px-4">
      <div className="flex flex-col space-y-4 md:space-y-12 md:max-w-6xl xl:max-w-7xl m-auto mb-[20vh] tracking-tight">
        <motion.p className="text-[2.4rem] font-extrabold text-left leading-[1.2] md:leading-[0.8] md:text-8xl md:max-w-6xl">
          {heading}
        </motion.p>
        <Link href="/events" className="w-fit">
          <Button className="w-40 md:w-60 md:h-16 md:text-xl">
            Browse Events
          </Button>
        </Link>
      </div>
      <Image
        className="-z-50 absolute inset-0 opacity-60"
        width={0}
        height={0}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={100}
        alt="hero-image"
        src={"/static/hero/anime.jpg"}
      />
    </section>
  );
}
