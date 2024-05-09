"use client";

import { type Vendor } from "./Vendors";
import { type TagData } from "../../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import MainVendorCard from "./MainVendorCard";
import SubVendorCard from "./SubVendorCard";
import VendorGroup from "./VendorGroup";

export default function ListVendors({
  allVendors,
  tags,
}: {
  allVendors: Vendor[];
  tags: TagData[];
}) {
  const [filter, setFilter] = useState("All");

  const filteredVendors = useMemo(() => {
    if (filter === "All") {
      return allVendors;
    }
    return allVendors.filter((vendor) => vendor.tags.includes(filter));
  }, [filter, allVendors]);

  const handleClickFilter = (tag: string) => {
    setFilter(tag);
  };
  return (
    <>
      <div className="flex flex-wrap gap-1">
        <Button
          className={cn(
            `text-xs md:text-sm p-2 h-6 text-foreground decoration-primary`,
            filter === "All" && "underline"
          )}
          onClick={() => handleClickFilter("All")}
          variant={"link"}
        >
          All
        </Button>
        {tags.map(({ tags }) => (
          <Button
            onClick={() => handleClickFilter(tags.name)}
            className={cn(
              `text-xs md:text-sm p-2 h-6 text-foreground decoration-primary`,
              filter === tags.name && "underline"
            )}
            variant={"link"}
          >
            {tags.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {filteredVendors[0] && <MainVendorCard vendor={filteredVendors[0]} />}
        {filteredVendors[1] && <SubVendorCard vendor={filteredVendors[1]} />}
        {filteredVendors[2] && <SubVendorCard vendor={filteredVendors[2]} />}
      </div>
      {filteredVendors.length > 3 && (
        <VendorGroup vendors={filteredVendors.slice(3)} />
      )}
    </>
  );
}
