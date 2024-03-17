"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";

export default function Create() {
  return (
    <div className="lg:col-span-1 w-full h-[500px]">
      <CardFilp>
        <div className="lg:col-span-3 h-full">
          <ColoredCard color="bg-tertiary">
            <h2 className="text-3xl">Book Vendor Tables Hassle-Free</h2>
            <p>
              Our easy to use application process makes booking vendors tables a
              breeze.
            </p>
          </ColoredCard>
        </div>
      </CardFilp>
    </div>
  );
}
