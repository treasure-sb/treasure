"use client";

import EditTickets from "./tickets/EditTickets";
import EditVendors from "./EditVendors";
import EditEventInfo from "./EditEventInfo";
import SelectEdit from "./SelectEdit";
import { useState } from "react";
import { Tables } from "@/types/supabase";

export default function AllEdit({ tickets }: { tickets: Tables<"tickets">[] }) {
  const [active, setActive] = useState("Tickets");

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div>
      <SelectEdit active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Tickets" && <EditTickets tickets={tickets} />}
        {active === "Vendors" && <EditVendors />}
        {active === "Event Info" && <EditEventInfo />}
      </div>
    </div>
  );
}
