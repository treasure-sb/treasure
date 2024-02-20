"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PreviewMoreCard from "./PreviewMoreCard";
import Image from "next/image";

export enum AnimateFrom {
  LEFT = "left",
  RIGHT = "right",
}

const previews = [
  {
    title: "See who's going ahead of time",
    description:
      "Discover which celebrites and icons will be in attendance. Enter giveaways and contests before the event starts.",
    animateFrom: AnimateFrom.LEFT,
  },
  {
    title: "Plan your perfect event calendar",
    description:
      "Organize your visits to upcoming shows and tailor your schedule to the biggest events.",
    animateFrom: AnimateFrom.RIGHT,
  },
  {
    title: "Book your ticket or table in seconds",
    description:
      "Secure your spot at the next big event. Whether as a guest or a vendor, we've got you covered.",
    animateFrom: AnimateFrom.LEFT,
  },
];

export default function PreviewMore() {
  const [activePreview, setActivePreview] = useState(0);

  return (
    <section className="my-60 w-full">
      <h1 className="text-3xl font-semibold text-center mb-14">
        Preview Celebrities, Vendors, Giveaways, and More
      </h1>
      <div className="md:flex md:justify-between p-10 md:p-0 md:space-x-10">
        <div className="hidden md:flex flex-col justify-between aspect-h-1 md:my-2 lg:my-20 max-w-xl">
          {previews.map((preview, index) => {
            return (
              <motion.div
                key={index}
                onHoverStart={() => setActivePreview(index)}
                animate={{
                  color: activePreview === index ? "#ffffff" : "#707070",
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="md:space-y-4"
              >
                <h1 className="text-xl md:text-2xl font-semibold">
                  {preview.title}
                </h1>
                <h2 className="text-xs sm:text-sm">{preview.description}</h2>
              </motion.div>
            );
          })}
        </div>
        <div className="relative">
          <Image
            className="w-full rounded-sm m-auto"
            alt="preview celebrites, vendors, guests, and more"
            src={"/static/preview.png"}
            width={1400}
            height={1400}
            quality={100}
          />
        </div>
      </div>
    </section>
  );
}
