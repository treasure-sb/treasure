"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";

export default function Preview() {
  return (
    <div className="[perspective:800px] w-full h-[500px]">
      <CardFilp>
        <ColoredCard color="bg-primary">
          <h2 className="text-3xl">
            Preview Celebrities, Vendors, Giveaways, and More
          </h2>
          <p>
            Discover which celebrites and icons will be in attendance. Enter
            giveaways and contests before the event starts.
          </p>
        </ColoredCard>
      </CardFilp>
    </div>
  );
}
