"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState(searchParams.get("filter") || "Events");
  const { replace } = useRouter();

  const handleClick = (filter: string) => {
    if (filter === active) return;

    const params = new URLSearchParams(searchParams);
    if (filter === "Events") {
      params.delete("filter");
      setActive("Events");
    } else {
      params.set("filter", filter);
      setActive(filter);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={searchParams.get("filter") || "Events"}
      className="flex items-center"
    >
      <TabsList className="m-auto">
        <TabsTrigger onClick={() => handleClick("Events")} value="Events">
          Events
        </TabsTrigger>
        <TabsTrigger onClick={() => handleClick("Photos")} value="Photos">
          Photos
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
