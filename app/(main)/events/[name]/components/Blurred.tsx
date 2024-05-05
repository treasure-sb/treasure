"use client";
import { motion } from "framer-motion";

import Image from "next/image";

export default function Blurred({ posterUrl }: { posterUrl: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.175 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 -z-50 overflow-hidden -mt-32 -mx-4 sm:-mx-8"
    >
      <div className="-z-20 absolute inset-0 pointer-events-none">
        <Image
          className="rounded-xl w-full h-full object-cover blur-xl"
          alt="blurred event poster"
          src={posterUrl}
          width={100}
          height={100}
        />
      </div>
      <div className="-z-10 absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent to-background" />
    </motion.div>
  );
}
