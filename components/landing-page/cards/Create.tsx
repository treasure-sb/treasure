"use client";
import CardFilp from "@/components/ui/custom/card-flip";
import { BadgeCheckIcon } from "lucide-react";

export default function Create() {
  return (
    <CardFilp>
      <div className="h-[500px]  mx-4 sm:m-auto flex flex-col justify-between px-8 py-10 rounded-sm bg-[#eac362] bg-opacity-20">
        <div className="space-y-4">
          <BadgeCheckIcon size={36} className="text-tertiary" />
          <h2 className="text-3xl">Create Beautiful Events</h2>
        </div>

        <p className="text-lg">
          Spotlight your brand with pages custom to you.
        </p>
      </div>
    </CardFilp>
  );
}
