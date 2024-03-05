"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function BookVendorTables() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacityOne = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.9],
    [1, 1, 1, 1, 1]
  );

  const opacityDotsOne = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.5, 0.9],
    [0, 0, 0, 1, 1]
  );

  const opacityTwo = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 0.8],
    [0, 0, 0, 1, 1, 1]
  );

  const opacityDotsTwo = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 0.8],
    [0, 0, 0, 0, 1, 1]
  );

  const opacityThree = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 0.8],
    [0, 0, 0, 1]
  );

  const animatedDots = Array.from({ length: 3 }, (_, index) => {
    return (
      <motion.div
        style={{ backgroundColor: "#ffffff" }}
        initial={{ backgroundColor: "#ffffff" }}
        animate={{
          backgroundColor: [
            "#ffffff",
            "#71d08c",
            "#71d08c",
            "#71d08c",
            "#ffffff",
          ],
        }}
        key={index}
        transition={{
          delay: 1 * index,
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 1.7,
          ease: "easeInOut",
        }}
        className="h-[0.25rem] w-[0.25rem] rounded-full"
      />
    );
  });

  return (
    <section className="mt-[-50vh] md:mt-[-70vh] h-[400vh] md:h-[260vh] relative space-y-40">
      <div className="sticky top-2 sm:top-[10vh] flex flex-col md:flex-row space-y-6 md:justify-between md:items-center max-w-6xl xl:max-w-7xl m-auto">
        <div className="flex flex-col space-y-6 md:space-y-12 mb-8 md:mb-0 m-auto md:mx-0">
          <motion.div
            style={{ opacity: opacityOne }}
            className="space-y-4 w-80"
          >
            <Image
              className="w-[55%] md:w-full m-auto"
              alt="preview celebrites, vendors, guests, and more"
              src={"/static/simple_application.png"}
              width={1400}
              height={1400}
              quality={100}
            />
          </motion.div>
          <motion.div
            style={{ opacity: opacityDotsOne }}
            className="space-y-2 flex flex-col items-center"
          >
            {animatedDots}
          </motion.div>
          <motion.div
            style={{ opacity: opacityTwo }}
            className="space-y-4 w-80"
          >
            <Image
              className="w-[55%] md:w-full m-auto"
              alt="preview celebrites, vendors, guests, and more"
              src={"/static/one_click.png"}
              width={1400}
              height={1400}
              quality={100}
            />
          </motion.div>
          <motion.div
            style={{ opacity: opacityDotsTwo }}
            className="space-y-2 flex flex-col items-center"
          >
            {animatedDots}
          </motion.div>
          <motion.div
            style={{ opacity: opacityThree }}
            className="space-y-4 w-80"
          >
            <Image
              className="w-[55%] md:w-full m-auto"
              alt="preview celebrites, vendors, guests, and more"
              src={"/static/pay_now.png"}
              width={1400}
              height={1400}
              quality={100}
            />
          </motion.div>
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-3xl text-left md:text-right md:max-w-2xl font-semibold">
              Book Vendor Tables <i>Hassle-Free</i>
            </h1>
            <p className="text-xl md:text-right text-left md:max-w-xl">
              Our easy to use application process makes booking vendors tables a
              breeze.
            </p>
          </div>
          <div className="w-full flex justify-end">
            <Link href="/events">
              <Button>Browse Events</Button>
            </Link>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 0.75, 1, 1.25, 1] }}
          transition={{
            ease: "easeInOut",
            repeat: Infinity,
            duration: 8,
            delay: 4,
          }}
          className="w-40 h-40 md:w-[42rem] md:h-[42rem] rounded-full blur-3xl absolute top-0 bg-primary opacity-20 md:opacity-10 z-[-10]"
        />
        <motion.div
          initial={{ scale: 0.75 }}
          animate={{ scale: [0.75, 1.25, 0.75] }}
          transition={{ ease: "easeInOut", repeat: Infinity, duration: 8 }}
          className="w-60 h-60 md:w-[32rem] md:h-[32rem] rounded-full blur-3xl absolute bottom-0 left-0 md:left-40 bg-tertiary opacity-20 md:opacity-10 z-[-10]"
        />
        <motion.div
          initial={{ scale: 0.75 }}
          animate={{ scale: [0.75, 1, 0.75] }}
          transition={{
            ease: "easeInOut",
            repeat: Infinity,
            duration: 8,
            delay: 3,
          }}
          className="w-40 h-40 md:w-[32rem] md:h-[32rem] rounded-full blur-3xl absolute bottom-1/2 md:bottom-10 left-20 md:left-3/4 bg-secondary opacity-80 md:opacity-40 z-[-10]"
        />
      </div>
      <div ref={ref} className="h-[120vh]" />
    </section>
  );
}
