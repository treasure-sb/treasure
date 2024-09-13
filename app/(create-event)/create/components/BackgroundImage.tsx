"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function BackgroundImage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
    >
      <Image
        src="/static/create_event.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
        alt="Background"
      />
    </motion.div>
  );
}
