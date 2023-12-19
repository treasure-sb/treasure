"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  const heading = "Find Great Card & Collectible Events Near You";
  const words = heading.split(/(\s+)/).map((word, index) => {
    const isEvent = word === "Events";
    const isSpace = word === " ";
    return (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1 + index * 0.03,
          duration: 0.65,
          ease: "easeInOut",
        }}
        className={isSpace ? "" : "inline-block"}
      >
        {isEvent ? (
          <span className="bg-gradient-to-r from-primary to-green-200 text-transparent bg-clip-text">
            {word}
          </span>
        ) : (
          word
        )}
      </motion.span>
    );
  });

  return (
    <div className="min-h-[calc(75vh-80px)] md:min-h-[calc(85vh-80px)] pt-28 w-full">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className="z-10 relative max-w-6xl text-[2.8rem] font-bold text-center m-auto leading-[1.2] md:leading-[1.3] md:text-8xl md:max-w-4xl"
        >
          {words}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 2.5, duration: 0.75, ease: "easeInOut" }}
          className="z-[-10] bg-green-200 w-60 h-60 md:w-[22rem] md:h-[22rem] top-[-60px] left-0 absolute rounded-full bg-opacity-40 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 2.5, duration: 0.75, ease: "easeInOut" }}
          className="z-[-10] bg-green-200 w-60 h-60 md:w-[22rem] md:h-[22rem] top-2 right-5 absolute rounded-full bg-opacity-40 blur-3xl"
        />
      </div>
      <div className="z-10 w-full flex justify-center items-center space-x-4">
        <Link className="mt-6" href="/events">
          <Button className="rounded-full" asChild>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.65, duration: 0.55, ease: "easeInOut" }}
              className="text-black w-40 md:w-52 md:py-8 md:text-xl block font-semibold rounded-full"
            >
              Browse Events
            </motion.button>
          </Button>
        </Link>
        <Link className="mt-6" href="/profile/create-event">
          <Button variant={"ghost"} asChild>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.65, duration: 0.55, ease: "easeInOut" }}
              className="text-white w-40 md:w-52 md:py-8 md:rounded-full md:text-xl block font-semibold hover:bg-transparent"
            >
              Create Event
            </motion.button>
          </Button>
        </Link>
      </div>
    </div>
  );
}
