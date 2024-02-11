"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import PreviewMoreCard from "./PreviewMoreCard";

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
    <section className="my-32 w-full">
      <h1 className="text-3xl font-semibold text-center mb-14">
        Preview Celebrities, Vendors, Giveaways, and More
      </h1>
      <div className="flex flex-col sm:hidden space-y-12">
        {previews.map((preview, index) => (
          <PreviewMoreCard key={index} {...preview} />
        ))}
      </div>
      <div className="sm:flex justify-between hidden space-x-6">
        <div className="flex flex-col justify-between aspect-h-1 md:my-2 lg:my-20">
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
        <div className="w-[50%] bg-tertiary aspect-w-2 aspect-h-1 rounded-sm flex-shrink-0" />
      </div>
    </section>
  );
}
