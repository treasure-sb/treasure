"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, LucideArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Hero() {
  const [currentTag, setCurrentTag] = useState(0);
  const tags = [
    "Hobby",
    "Collectible",
    "Pokémon Card",
    "Sports Card",
    "Comic Book",
    "Toy and TCG",
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
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("featured-events");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="h-[100vh]  mt-[-19.5%] md:-mt-28 justify-end flex flex-col-reverse lg:flex-row lg:space-x-10 lg:space-y-0 lg:items-end overflow-hidden">
      {/* Your existing Hero content */}

      <div className="text-center flex flex-col space-y-6 tracking-tight max-h-[50%] md:max-h-full md:my-auto">
        <p className="text-4xl text-black font-semibold lg:text-8xl lg:max-w-6xl md:text-2xl min-w-fit min-h-fit">
          Find More Hobby Events You Love <br />
          <span className="text-[#2AAA88]">Every Weekend</span>
        </p>
        <p className="text-black font-semibold text-center text-md whitespace-pre-wrap">
          Join the #1 community for card shows and hobby events. <br />
          We make getting tickets and tables easy.
        </p>
        <div className="flex flex-row justify-center gap-8">
          <Link
            href="/login?redirect=/home"
            className="w-fit flex items-center space-x-1 md:space-x-2 group self-center"
          >
            <Button className="text-white">
              <p className="mr-1">Get Started Now</p>
              <LucideArrowUpRight
                size={30}
                className="text-white hidden lg:block group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
              />
              <LucideArrowUpRight
                size={20}
                className="text-white block lg:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
              />
            </Button>
          </Link>
          <Link
            href="/events"
            className="w-fit flex items-center space-x-1 md:space-x-2 group self-center"
          >
            <Button className="text-black bg-transparent border-2 border-black">
              <p className="text mr-1">Browse Events</p>
              <LucideArrowUpRight
                size={30}
                className="text-black hidden lg:block group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
              />
              <LucideArrowUpRight
                size={20}
                className="text-black block lg:hidden group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300 group-hover:text-primary/80"
              />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-5 min-w-full">
          <button
            onClick={scrollToNextSection}
            className="transform -translate-x-1/2 animate-bounce self-center"
            aria-label="Scroll to next section"
          >
            <ChevronDown size={32} color="black" />
          </button>
        </div>
      </div>
      <div className="w-[50%] h-full hidden lg:block">
        <Image
          className="w-full h-full object-fit rounded-md object-center sm:max-[1200px]:hidden lg:block"
          quality={100}
          priority
          src="/static/landing-page/Hero Image.png"
          alt="hero image"
          width={2000}
          height={2000}
        />
        <motion.div
          initial={{ height: "100%" }}
          animate={{ height: "0%" }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 bg-background"
        />
      </div>
      <div className="h-fit lg:hidden">
        <Image
          className="h-fit object-top object-contain mt-14 md:hidden lg:block"
          quality={100}
          src="/static/landing-page/Hero Image.png"
          priority
          alt="hero image"
          height={2000}
          width={2000}
        />
      </div>
    </section>
  );
}
