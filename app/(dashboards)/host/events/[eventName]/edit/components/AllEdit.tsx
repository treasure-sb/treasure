"use client";

import EditTickets from "./tickets/EditTickets";
import EditVendors from "./EditVendors";
import EditEventInfo from "./event_info/EditEventInfo";
import SelectEdit from "./SelectEdit";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { EventHighlightPhotos } from "../types";

export default function AllEdit({
  tickets,
  event,
  previousHighlights,
}: {
  tickets: Tables<"tickets">[];
  event: Tables<"events">;
  previousHighlights: EventHighlightPhotos[];
}) {
  const [active, setActive] = useState("Event");

  const handleSelect = (selected: string) => {
    setActive(selected);
  };

  return (
    <div>
      <SelectEdit active={active} onSelect={handleSelect} />
      <div className="mt-8">
        {active === "Event" && (
          <EditEventInfo
            event={event}
            previousHighlights={previousHighlights}
          />
        )}
        {active === "Tickets" && <EditTickets tickets={tickets} />}
        {active === "Vendors" && <EditVendors />}
      </div>
    </div>
  );
}
