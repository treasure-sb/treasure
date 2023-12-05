"use client";
import { motion } from "framer-motion";

export default function Star() {
  return (
    <motion.div
      className="absolute left-5 top-40 w-6 h-6 bg-primary transform rotate-45"
      animate={{ x: 100 }}
      transition={{ ease: "easeIn", duration: 2 }}
    />
  );
}
