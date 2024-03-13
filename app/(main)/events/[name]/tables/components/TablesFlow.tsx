"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useVendorFlowStore } from "../store";
import { useVendorApplicationStore } from "./vendor_applications/store";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import VendorApplication from "./vendor_applications/VendorApplication";
import AllTables from "./all_tables/AllTables";

export default function TablesFlow({
  eventDisplay,
  user,
  tables,
  vendorInfo,
  terms,
  profile,
}: {
  eventDisplay: EventDisplayData;
  user: User | null;
  tables: Tables<"tables">[];
  vendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: Tables<"profiles"> | null;
}) {
  const { currentView } = useVendorFlowStore();

  useEffect(() => {
    useVendorFlowStore.setState({
      vendorInfo: vendorInfo,
      event: eventDisplay,
      terms,
      profile,
    });
  }, []);

  return (
    <main className="max-w-lg m-auto">
      <AnimatePresence mode="wait">
        {currentView === "ALL_TABLES" && (
          <motion.div
            key="all-tables"
            exit={{ opacity: 0, y: 3, transition: { duration: 0.5 } }}
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
            initial={{ opacity: 0, y: 3 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5 },
            }}
          >
            <VendorApplication />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
