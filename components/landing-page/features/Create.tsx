"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";

export default function Create() {
  return (
    <div className="w-full h-[500px]">
      <CardFilp>
        <ColoredCard color="bg-red-500">
          <h2 className="text-3xl">Create Beautiful Events in Seconds</h2>
          <p>Spotlight your brand with pages custom to you.</p>
        </ColoredCard>
      </CardFilp>
    </div>
  );
}
