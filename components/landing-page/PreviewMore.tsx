"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function PreviewMore() {
  const [isChildInView, setIsChildInView] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: isChildInView ? 1 : 0,
        y: isChildInView ? 0 : 10,
      }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      className="my-40 md:my-60 w-full flex flex-col-reverse md:flex-row md:justify-between md:items-center"
    >
      <div className="space-y-8">
        <div className="space-y-2 max-w-xl">
          <h1 className="text-3xl md:text-3xl text-left md:max-w-lg font-semibold">
            Preview Celebrities, Vendors, Giveaways, and More
          </h1>
          <p className="text-xl max-w-2xl">
            Discover which celebrites and icons will be in attendance. Enter
            giveaways and contests before the event starts.
          </p>
        </div>
        <div className="w-full flex justify-end md:justify-start">
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ ease: "easeInOut", repeat: Infinity, duration: 6 }}
        className="relative mb-8 md:mb-0"
      >
        <Image
          className="w-[80%] md:w-full m-auto"
          alt="preview celebrites, vendors, guests, and more"
          src={"/static/preview.png"}
          width={1400}
          height={1400}
          quality={100}
        />
        <div className="hidden md:block md:absolute inset-0 z-[-10] w-full h-full blur-3xl opacity-20 bg-primary" />
        <motion.div
          className="absolute bottom-3/4"
          onViewportEnter={() => setIsChildInView(true)}
        />
      </motion.div>
    </motion.section>
  );
}
