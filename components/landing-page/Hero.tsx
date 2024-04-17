"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LucideArrowUpRight } from "lucide-react";
import Link from "next/link";
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
    <section className="h-[100vh] pb-40 relative max-w-[var(--container-width)] m-auto flex flex-col-reverse space-y-10 lg:flex-row lg:space-x-10 lg:space-y-0 lg:items-end overflow-hidden">
      <div className="text-left flex flex-col space-y-4 md:space-y-12 tracking-tight pb-4">
        <p className="text-3xl font-semibold lg:text-8xl lg:max-w-6xl">
          Card and <br className="hidden 2xl:block" />
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
          <p className="text-primary font-semibold text-2xl lg:text-6xl group-hover:text-primary/80 transition duration-300">
            Browse Events
          </p>
          <LucideArrowUpRight
            size={70}
            className="text-primary hidden lg:block group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
          />
          <LucideArrowUpRight
            size={30}
            className="text-primary block lg:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
          />
        </Link>
      </div>
      <Image
        className="hidden lg:block w-[40%] h-full object-cover rounded-md"
        quality={100}
        src="/static/landing-page/fenway3.png"
        alt="hero image"
        width={2000}
        height={2000}
        objectFit="cover"
        objectPosition="center"
      />
      <div className="flex lg:hidden mx-[-32px] relative h-full z-40">
        <Image
          className="absolute top-0 left-0 w-[60%] h-[50%] object-cover rounded-md rotate-2 z-10"
          quality={100}
          src="/static/landing-page/fenway2.png"
          alt="hero image"
          width={2000}
          height={2000}
          objectFit="cover"
          objectPosition="center"
        />
        <Image
          className="absolute top-0 left-[38%] mt-20 w-[60%] h-[50%] object-cover rounded-md -rotate-3 z-20"
          quality={100}
          src="/static/landing-page/fenway3.png"
          alt="hero image"
          width={2000}
          height={2000}
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </section>
  );
}
