"use client";
import { motion } from "framer-motion";
import CardFilp from "../../ui/custom/card-flip";
import { CircleDollarSignIcon } from "lucide-react";

export default function Create() {
  return (
    <CardFilp>
      <div className="h-[500px] flex flex-col justify-between border px-8 py-10 rounded-sm bg-black bg-opacity-10">
        <div className="space-y-4">
          <CircleDollarSignIcon size={32} />
          <h4 className="text-3xl">Get Paid in Advance</h4>
        </div>

        <p>
          Keep track of your sales and get paid in advance with our easy to use
          event tools.
        </p>
      </div>
    </CardFilp>
  );
}
