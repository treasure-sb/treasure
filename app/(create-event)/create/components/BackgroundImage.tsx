"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function BackgroundImage() {
  const { theme } = useTheme();

  return (
    theme === "light" && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={cn("absolute inset-0")}
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
    )
  );
}
