"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  return (
    <motion.div
      className="lg:grid grid-cols-3 gap-6 min-h-[calc(100vh-24rem)] flex flex-col"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: "easeInOut" }}
    >
      <Link
        href={`/host/events/${event}/vendors`}
        className="bg-primary text-background rounded-md col-span-2 p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500 rounded-md" />
        <h1 className="font-semibold text-3xl">Event Vendors</h1>
      </Link>
      <Link
        href={`/host/events/${event}/message`}
        className="border-[1px] border-primary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500 rounded-md" />
        <h1 className="font-semibold text-3xl">Message Vendors</h1>
      </Link>
      <Link
        href={`/host/events/${event}/sales`}
        className="bg-tertiary text-background rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group "
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500" />
        <h1 className="font-semibold text-3xl">Sales</h1>
      </Link>
      <Link
        href={`/host/events/${event}/edit`}
        className="bg-secondary col-span-2 rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500" />
        <h1 className="font-semibold text-3xl">Event Info</h1>
      </Link>
    </motion.div>
  );
}
