"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventFilters from "./EventFilters";

export default function UserFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState(searchParams.get("tab") || "Events");
  const { replace } = useRouter();

  const handleClick = (tab: string) => {
    if (tab === active) return;

    const params = new URLSearchParams(searchParams);
    if (tab === "Events") {
      params.delete("tab");
      setActive("Events");
    } else {
      params.delete("events");
      params.set("tab", tab);
      setActive(tab);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      defaultValue={searchParams.get("filter") || "Events"}
      className="flex items-center flex-col"
    >
      <TabsList className="m-auto mb-2">
        <TabsTrigger onClick={() => handleClick("Events")} value="Events">
          Events
        </TabsTrigger>
        <TabsTrigger onClick={() => handleClick("Photos")} value="Photos">
          Photos
        </TabsTrigger>
      </TabsList>
      <TabsContent asChild className="w-[80%]" value="Events">
        <EventFilters />
      </TabsContent>
    </Tabs>
  );
}
