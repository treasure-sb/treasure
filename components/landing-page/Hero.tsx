"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, cubicBezier } from "framer-motion";

export default function Hero() {
  const easeInOut = cubicBezier(0.82, -0.005, 0.59, 0.99);

  return (
    <section className="max-w-[var(--container-width)] m-auto h-[calc(100svh-128px)] flex flex-col space-y-14 space-x-0 sm:flex-row sm:space-y-0 sm:space-x-8 items-center justify-center sm:pb-10">
      <div className="w-full sm:mt-auto tracking-tight">
        <p className="text-4xl font-bold text-left leading-tight md:leading-tight md:text-6xl md:max-w-md 2xl:max-w-xl mb-4">
          The Best Sports, Pokemon, and TCG Events Near You
        </p>
        <Link href="/events">
          <p className="inline-block w-fit text-2xl md:text-4xl font-semibold text-primary underline-offset-8 underline">
            Browse Events
          </p>
        </Link>
      </div>
      <div className="w-full max-w-xl h-full relative">
        <Image
          loading="eager"
          className="h-full w-full object-cover rounded-sm"
          width={1000}
          height={1000}
          quality={100}
          alt="hero-image"
          src={"/static/hero/convention2.jpg"}
        />
        <motion.div
          initial={{ height: "100%" }}
          animate={{ height: 0 }}
          transition={{ duration: 0.55, ease: easeInOut, delay: 0.1 }}
          className="bg-background absolute inset-0"
        />
      </div>
    </section>
  );
}
