"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";
import BookEventIcon from "@/components/icons/BookEventIcon";

export default function Create() {
  return (
    <div className="lg:col-span-1 w-full h-[500px] flex flex-col justify-between border px-8 py-10 rounded-sm bg-black shadow-2xl shadow-primary">
      <div>
        <BookEventIcon />
        <h2 className="text-3xl mt-10">Book Tables Hassle-Free</h2>
      </div>

      <p>
        Our easy to use application process makes booking vendors tables a
        breeze.
      </p>
    </div>
  );
}
