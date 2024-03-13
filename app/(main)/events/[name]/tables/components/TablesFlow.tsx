"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useVendorFlowStore } from "../store";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import VendorApplication from "./vendor_applications/VendorApplication";
import AllTables from "./AllTables";

export default function TablesFlow({
  eventDisplay,
  tables,
  user,
}: {
  eventDisplay: EventDisplayData;
  tables: Tables<"tables">[];
  user: User | null;
}) {
  const currentView = useVendorFlowStore((state) => state.currentView);

  return (
    <main className="max-w-lg m-auto">
      <AnimatePresence mode="wait">
        {currentView === "ALL_TABLES" && (
          <motion.div
            key="all-tables"
            exit={{ opacity: 0, y: 5, transition: { duration: 0.6 } }}
          >
            <AllTables
              eventDisplay={eventDisplay}
              tables={tables}
              user={user}
            />
          </motion.div>
        )}
        {currentView === "APPLICATION" && (
          <motion.div
            key="vendor-application"
            initial={{ opacity: 0, y: 5 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            }}
          >
            <VendorApplication event={eventDisplay} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
