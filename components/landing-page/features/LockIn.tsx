"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";
import CoinsIcon from "@/components/icons/CoinsIcon";

export default function Create() {
  return (
    <div className="w-full h-[500px] flex flex-col justify-between border px-8 py-10 rounded-sm bg-black shadow-2xl shadow-primary">
      <div>
        <CoinsIcon />
        <h2 className="text-3xl mt-10">Get Paid in Advance</h2>
      </div>

      <p>
        Keep track of your sales and get paid in advance with our easy to use
        event tools.
      </p>
    </div>
  );
}
