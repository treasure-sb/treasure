"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Cancel from "@/components/icons/Cancel";
import DateFiltering from "./DateFiltering";

export default function FilteringButtons() {
  const [clickedSearch, setClickedSearch] = useState(false);

  return (
    <div
      className={`${
        clickedSearch
          ? "flex-col space-x-0 space-y-2 md:flex-row md:space-x-2 md:space-y-0"
          : "flex-row"
      } flex space-x-2 mb-2`}
    >
      <div className="flex space-x-2">
        <Button>New York, NY</Button>
        <DateFiltering />
      </div>
      <>
        {clickedSearch ? (
          <div className="w-full flex space-x-1 items-center md:h-8">
            <Input
              className="w-full md:w-[50%]"
              placeholder="Search for Events"
            />
            <Cancel handleCancel={() => setClickedSearch(false)} />
          </div>
        ) : (
          <Button
            onClick={() => setClickedSearch(true)}
            variant={"ghost"}
            className="rounded-full px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              version="1.1"
              viewBox="200 150 800 1000"
              fill="white"
            >
              <path
                d="m735.72 769.12 154.59 154.59c9.2109 9.2109 24.184 9.2109 33.395 0 9.2109-9.2109 9.2109-24.184 0-33.395l-154.59-154.59c41.824-49.379 67.047-113.24 67.047-182.95 0-156.41-126.98-283.39-283.39-283.39-156.41 0-283.39 126.98-283.39 283.39 0 156.41 126.98 283.39 283.39 283.39 69.715 0 133.57-25.223 182.95-67.047zm-182.95-452.51c130.34 0 236.16 105.82 236.16 236.16 0 130.34-105.82 236.16-236.16 236.16-130.34 0-236.16-105.82-236.16-236.16 0-130.34 105.82-236.16 236.16-236.16z"
                fill-rule="evenodd"
              />
            </svg>
          </Button>
        )}
      </>
    </div>
  );
}
