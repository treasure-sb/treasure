"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";
import CoinsIcon from "@/components/icons/CoinsIcon";
import GroupPartyIcon from "@/components/icons/GroupPartyIcon";

export default function Preview() {
  return (
    <div className="w-full h-[500px] flex flex-col justify-between border px-8 py-10 rounded-sm bg-black shadow-2xl shadow-primary">
      <div>
        <GroupPartyIcon />
        <h2 className="text-3xl mt-10">Preview Event Highlights</h2>
      </div>

      <p>
        Discover which celebrites and icons are attending. Enter giveaways and
        contests before the event starts.
      </p>
    </div>
  );
}
