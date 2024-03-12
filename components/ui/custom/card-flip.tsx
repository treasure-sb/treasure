"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CardFilp({ children }: { children: React.ReactNode }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 20 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="[perspective:800px] h-full"
    >
      <motion.div
        onClick={() => setIsFlipped(!isFlipped)}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="border-[1px] hover:cursor-pointer rounded-sm h-full relative [transform-style:preserve-3d]"
      >
        <div className="h-full w-full absolute [backface-visibility:hidden]">
          {children}
        </div>
        <motion.div
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          className="h-full w-full absolute p-10 [backface-visibility:hidden]"
        >
          FLIPPED
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
