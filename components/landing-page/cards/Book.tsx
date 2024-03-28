"use client";
import { CalendarCheck2Icon } from "lucide-react";
import CardFilp from "../../ui/custom/card-flip";

export default function Book() {
  return (
    <CardFilp>
      <div className="h-[500px] mx-4 sm:m-auto flex flex-col justify-between border px-8 py-10 rounded-sm bg-gray-300 bg-opacity-10">
        <div className="space-y-4">
          <CalendarCheck2Icon size={36} className="text-gray-300" />
          <h2 className="text-3xl">Book Tables Hassle-Free</h2>
        </div>

        <p className="text-lg">
          Our easy to use application process makes booking vendors tables a
          breeze.
        </p>
      </div>
    </CardFilp>
  );
}
