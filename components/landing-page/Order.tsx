"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Order() {
  const [isChildInView, setIsChildInView] = useState(false);
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: isChildInView ? 1 : 0,
        y: isChildInView ? 0 : 10,
      }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
      className="my-40 md:my-60 w-full flex flex-col md:flex-row-reverse md:items-center md:justify-between"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ ease: "easeInOut", repeat: Infinity, duration: 6 }}
        className="relative mb-8 md:mb-0"
      >
        <Image
          className="w-[60%] md:w-full m-auto rotate-0 md:rotate-1"
          alt="checkout order"
          src={"/static/order.png"}
          width={400}
          height={1400}
          quality={100}
        />
        <motion.div
          className="absolute bottom-3/4"
          onViewportEnter={() => setIsChildInView(true)}
        />
        <div className="hidden md:block md:absolute inset-0 z-[-10] w-full h-full blur-3xl opacity-20 bg-primary" />
      </motion.div>
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-3xl text-left md:text-left md:max-w-2xl font-semibold">
              Lock in Attendees & Get <i>Paid</i> in Advance
            </h1>
            <p className="text-xl md:max-w-xl">
              Secure your event's success and streamline your revenue with our
              easy to use event tools.
            </p>
          </div>
        </div>
        <div className="w-full flex justify-start">
          <Link href="/events">
            <Button>Browse Events</Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
