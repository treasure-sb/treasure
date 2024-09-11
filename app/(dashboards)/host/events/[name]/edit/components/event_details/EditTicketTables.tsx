"use client";

import { Tables } from "@/types/supabase";
import { motion } from "framer-motion";
import { useState } from "react";
import EditTables from "./tables/EditTables";
import EditTickets from "./tickets/EditTickets";

import { TicketDetails } from "./EditEventDetails";

export default function EditTicketTables({
  tickets,
  eventDates,
  tables,
  eventId,
}: {
  tickets: TicketDetails[];
  eventDates: Tables<"event_dates">[];
  tables: Tables<"tables">[];
  eventId: string;
}) {
  const [edit, setEdit] = useState(false);
  const handleParentEdit = (toggleEdit: boolean) => {
    setEdit(toggleEdit);
  };

  return (
    <motion.div
      layout
      transition={{ duration: 0.15, type: "spring", stiffness: 55 }}
      className="mt-8 md:mt-12 space-y-8 rounded-2xl border-[1px] border-foreground/10 bg-slate-500/10 bg-opacity-20 py-4 px-6 z-10"
    >
      <EditTickets
        tickets={tickets}
        eventDates={eventDates}
        setParentEdit={handleParentEdit}
        eventId={eventId}
      />
      <EditTables
        tables={tables}
        setParentEdit={handleParentEdit}
        eventId={eventId}
      />
    </motion.div>
  );
}
