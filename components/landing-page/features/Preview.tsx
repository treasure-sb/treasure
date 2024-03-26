"use client";
import GroupPartyIcon from "@/components/icons/GroupPartyIcon";
import CardFilp from "@/components/ui/custom/card-flip";

export default function Preview() {
  return (
    <CardFilp>
      <div className="h-[500px] mx-4 m-auto flex flex-col justify-between border px-8 py-10 rounded-sm bg-[#71d08c] bg-opacity-10">
        <div className="space-y-4">
          <GroupPartyIcon />
          <h4 className="text-3xl">Preview Event Highlights</h4>
        </div>
        <p>
          Discover which celebrites and icons are attending. Enter giveaways and
          contests before the event starts.
        </p>
      </div>
    </CardFilp>
  );
}
