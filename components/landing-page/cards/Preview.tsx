"use client";
import GroupPartyIcon from "@/components/icons/GroupPartyIcon";
import CardFilp from "@/components/ui/custom/card-flip";

export default function Preview() {
  return (
    <CardFilp>
      <div className="h-[500px] mx-4 sm:mx-0 m-auto flex flex-col justify-between border px-8 py-10 rounded-sm bg-[#71d08c] bg-opacity-20">
        <div className="space-y-4">
          <GroupPartyIcon />
          <h4 className="text-3xl">Event Gallery</h4>
        </div>
        <p className="text-lg">
          Discover which celebrites and icons are attending. Enter giveaways and
          contests before the event starts.
        </p>
      </div>
    </CardFilp>
  );
}
