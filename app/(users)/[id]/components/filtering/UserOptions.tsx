"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * UserOptions is a React component that renders a set of tabs for different user options.
 *
 * The component leverages the URL's search parameters to determine and set the active tab.
 * It provides a tabbed interface for the user to switch between different views such as "Events" and "Photos".
 * Clicking on a tab will update the URL's search parameters accordingly, while also ensuring that the displayed content matches the selected tab.
 */
export default function UserOptions() {
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
    </Tabs>
  );
}
