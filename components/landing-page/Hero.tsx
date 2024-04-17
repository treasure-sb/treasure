"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const [currentTag, setCurrentTag] = useState(0);
  const tags = [
    "Collectible",
    "Pokémon",
    "Sports",
    "Comic Book",
    "TCG",
    "Toys",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTag((currentTag) => (currentTag + 1) % tags.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section className="h-[80vh] pt-28 relative max-w-[var(--container-width)] m-auto flex flex-row">
      <div className="text-left flex flex-col space-y-4 md:space-y-12 tracking-tight">
        <p className="text-[2.4rem] font-semibold leading-tight md:leading-snug md:text-7xl 2xl:text-8xl md:max-w-6xl">
          Card and <br className="block md:hidden" />
          <AnimatePresence mode="wait">
            <motion.span
              key={tags[currentTag]}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.4 }}
              className="text-primary inline-block"
            >
              {tags[currentTag]}
            </motion.span>
          </AnimatePresence>{" "}
          <br />
          Shows Every Weekend Near You
        </p>
        <Link
          href="/events"
          className="w-fit flex items-center space-x-1 md:space-x-2 group"
        >
          <p className="text-primary font-extrabold text-3xl md:text-5xl 2xl:text-6xl group-hover:text-primary/80 transition duration-300">
            Browse Events
          </p>
          <LucideArrowUpRight
            size={80}
            className="text-primary stroke-[3] hidden 2xl:block group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          />
          <LucideArrowUpRight
            size={70}
            className="text-primary stroke-[3] hidden md:block 2xl:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          />
          <LucideArrowUpRight
            size={40}
            className="text-primary stroke-[3] block md:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300"
          />
        </Link>
      </div>
      <div className="w-[30%] h-full">
        <Image
          className="w-full h-full"
          src="/static/landing-page/fenway.jpg"
          alt="hero image"
          width={300}
          height={400}
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </section>
  );
}
