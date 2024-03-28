"use client";
import CardFilp from "../../ui/custom/card-flip";
import { CircleDollarSignIcon } from "lucide-react";

export default function GetPaid() {
  return (
    <CardFilp>
      <div className="h-[500px] mx-4 sm:m-auto flex flex-col justify-between border px-8 py-10 rounded-sm bg-[#71d08c] bg-opacity-20">
        <div className="space-y-4">
          <CircleDollarSignIcon size={36} className="text-primary" />
          <h4 className="text-3xl">Get Paid in Advance</h4>
        </div>

        <p className="text-lg">
          Keep track of your sales and get paid in advance with our easy to use
          event tools.
        </p>
      </div>
    </CardFilp>
  );
}
