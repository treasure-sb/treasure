"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function BookVendorTables() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scaleOne = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.9],
    [1, 1.02, 1.02, 0.8, 0.8]
  );

  const scaleTwo = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 0.8],
    [1, 0.8, 0.8, 1.02, 1.02, 0.8]
  );

  const scaleThree = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 0.8],
    [1, 0.8, 0.8, 1.02]
  );

  const opacityOne = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.9],
    [1, 1, 1, 1, 1]
  );

  const opacityTwo = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 0.8],
    [0, 0, 0, 1, 1, 1]
  );

  const opacityThree = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 0.8],
    [0, 0, 0, 1]
  );

  return (
    <section className="mt-[-40vh] mx-[-10vh] h-[500vh] relative space-y-40">
      <div className="sticky top-[10vh]">
        <h1 className="text-center font-semibold text-3xl mb-12">
          Book Vendor Tables in Seconds
        </h1>
        <div className="md:flex md:justify-between space-y-12 md:space-y-0">
          <motion.div
            style={{ scale: scaleOne, opacity: opacityOne }}
            className="space-y-4 w-80"
          >
            <h1 className="text-xl">Quick Application + Table Selection</h1>
            <motion.div
              style={{ rotate: 1 }}
              animate={{ y: [-2, 4, -2] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-full aspect-w-1 aspect-h-2 bg-primary rounded-sm"
            />
          </motion.div>
          <motion.div
            style={{ scale: scaleTwo, opacity: opacityTwo }}
            className="space-y-4 w-80"
          >
            <h1 className="text-xl">Get Approved within 24 hours</h1>
            <motion.div
              style={{ rotate: 1 }}
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
            <motion.div
              style={{ rotate: -1 }}
              animate={{ y: [2, 0, 2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
          </motion.div>
          <motion.div
            style={{ scale: scaleThree, opacity: opacityThree }}
            className="space-y-4 w-80"
          >
            <h1 className="text-xl">Lock in and Get Featured</h1>
            <motion.div
              style={{ rotate: -1 }}
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
            <motion.div
              style={{ rotate: 1 }}
              animate={{ y: [2, 0, 2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
            <motion.div
              style={{ rotate: -2 }}
              animate={{ y: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
            <motion.div
              style={{ rotate: -1 }}
              animate={{ y: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full aspect-w-2 aspect-h-1 bg-primary rounded-sm"
            />
          </motion.div>
        </div>
      </div>
      <div ref={ref} className="h-[300vh]" />
    </section>
  );
}
