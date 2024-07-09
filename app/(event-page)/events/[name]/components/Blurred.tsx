"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Blurred({
  posterUrl,
  opacity = 0.3,
  marginX = true,
}: {
  posterUrl: string;
  opacity?: number;
  marginX?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: opacity }}
      transition={{ delay: 0.25, duration: 1.75 }}
      className={cn(
        "absolute inset-0 -z-50 overflow-hidden -mt-32",
        marginX && "-mx-4 sm:-mx-8"
      )}
    >
      <Image
        className="rounded-xl w-full h-[350px] -z-20 absolute object-cover object-top inset-0 pointer-events-none blur-2xl"
        alt="blurred event poster"
        src={posterUrl}
        width={1000}
        height={1000}
      />
      <div
        style={{
          background:
            "linear-gradient(to bottom, transparent 75%, #121212 100%)",
        }}
        className="-z-10 absolute inset-x-0 top-0 bottom-0"
      />
    </motion.div>
  );
}
