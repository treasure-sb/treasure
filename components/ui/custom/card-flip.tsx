"use client";
import { motion } from "framer-motion";

export default function CardFilp({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ rotateY: 16 }}
      whileInView={{ rotateY: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="[perspective:800px] h-full"
    >
      {children}
    </motion.div>
  );
}
