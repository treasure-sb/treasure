"use client";

import { type Vendor } from "./Vendors";
import { type TagData } from "../../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MainVendorCard from "./MainVendorCard";
import VendorGroup from "./VendorGroup";

export default function ListVendors({
  allVendors,
  tags,
}: {
  allVendors: Vendor[];
  tags: string[];
}) {
  const [filter, setFilter] = useState("All");
  const [numVendors, setNumVendors] = useState(4);
  const [vendors, setVendors] = useState<Vendor[]>(allVendors);

  const filteredVendors = useMemo(() => {
    if (filter === "All") {
      return vendors;
    }

    return vendors.filter((vendor) => vendor.tags.includes(filter));
  }, [filter, vendors]);

  const handleClickFilter = (tag: string) => {
    setFilter(tag);
  };

  return (
    <>
      <div className="flex flex-wrap gap-1">
        <Button
          className={cn(
            `text-xs md:text-sm p-2 h-6 decoration-primary text-muted-foreground`,
            filter === "All" && "underline text-foreground"
          )}
          onClick={() => handleClickFilter("All")}
          variant={"link"}
        >
          All
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag}
            onClick={() => handleClickFilter(tag)}
            className={cn(
              `text-xs md:text-sm p-2 h-6 text-muted-foreground decoration-primary`,
              filter === tag && "underline text-foreground"
            )}
            variant={"link"}
          >
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <AnimatePresence mode="wait">
          {filteredVendors.slice(0, numVendors).map((vendor) => (
            <MainVendorCard key={vendor.username} vendor={vendor} />
          ))}
        </AnimatePresence>
      </div>
      {filteredVendors.length > numVendors && (
        <VendorGroup vendors={filteredVendors.slice(numVendors)} />
      )}
      <div className="flex justify-center">
        {numVendors > 4 && (
          <Button
            variant={"link"}
            onClick={() => setNumVendors(4)}
            className="text-white hover:no-underline"
          >
            See Less
          </Button>
        )}
        {numVendors < filteredVendors.length && (
          <Button
            variant={"link"}
            onClick={() => setNumVendors((numVendors) => numVendors + 4)}
            className="text-white hover:no-underline"
          >
            See More
          </Button>
        )}
      </div>
      {filteredVendors.length === 0 && (
        <p className="text-center text-muted-foreground text-sm">
          No vendors found
        </p>
      )}
    </>
  );
}
