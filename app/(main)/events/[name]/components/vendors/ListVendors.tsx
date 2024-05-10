"use client";

import { type Vendor } from "./Vendors";
import { type TagData } from "../../types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
  const [vendors, setVendors] = useState<Vendor[]>(allVendors);

  const filteredVendors = useMemo(() => {
    if (filter === "All") {
      return vendors;
    }

    return vendors.filter((vendor) => vendor.tags.includes(filter));
  }, [filter, vendors]);

  const shuffleVendors = () => {
    const shuffled = vendors.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setVendors(shuffleVendors());
    const interval = setInterval(() => {
      if (filteredVendors.length > 4) {
        setVendors(shuffleVendors());
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

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
        {tags.map(({ tags }) => (
          <Button
            key={tags.id}
            onClick={() => handleClickFilter(tags.name)}
            className={cn(
              `text-xs md:text-sm p-2 h-6 text-muted-foreground decoration-primary`,
              filter === tags.name && "underline text-foreground"
            )}
            variant={"link"}
          >
            {tags.name}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <AnimatePresence mode="wait">
          {filteredVendors.slice(0, 4).map((vendor, index) => (
            <MainVendorCard key={vendor.username} vendor={vendor} />
          ))}
        </AnimatePresence>
      </div>
      {filteredVendors.length > 4 && (
        <VendorGroup vendors={filteredVendors.slice(4)} />
      )}
      {filteredVendors.length === 0 && (
        <p className="text-center text-muted-foreground text-sm">
          No vendors found
        </p>
      )}
    </>
  );
}
