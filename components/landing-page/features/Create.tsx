"use client";
import { motion } from "framer-motion";
import ColoredCard from "../../ui/custom/colored-card";
import CardFilp from "../../ui/custom/card-flip";
import CreateEventIcon from "@/components/icons/CreateEventIcon";

export default function Create() {
  return (
    <div className="w-full h-[500px] flex flex-col justify-between border px-8 py-10 rounded-sm bg-black shadow-2xl shadow-primary">
      <div>
        <CreateEventIcon />
        <h2 className="text-3xl mt-10">Create Beautiful Events</h2>
      </div>

      <p>Spotlight your brand with pages custom to you.</p>
    </div>
  );
}
