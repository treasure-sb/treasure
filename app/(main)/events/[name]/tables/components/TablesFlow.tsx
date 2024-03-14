"use client";
import { AnimatePresence, motion } from "framer-motion";
import { TableView, useVendorFlowStore } from "../store";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { useEffect } from "react";
import VendorApplication from "./vendor_applications/VendorApplication";
import AllTables from "./all_tables/AllTables";
import TableFlowProgress from "./TableFlowProgress";
import { useVendorApplicationStore } from "./vendor_applications/store";
import Complete from "./vendor_applications/steps/Complete";

export default function TablesFlow({
  eventDisplay,
  tables,
  vendorInfo,
  terms,
  profile,
}: {
  eventDisplay: EventDisplayData;
  tables: Tables<"tables">[];
  vendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: Tables<"profiles"> | null;
}) {
  const { currentView } = useVendorFlowStore();
  const { setVendorInfo } = useVendorApplicationStore();

  useEffect(() => {
    useVendorFlowStore.setState({
      vendorInfo: vendorInfo,
      event: eventDisplay,
      terms,
      profile,
    });

    if (profile) {
      setVendorInfo({
        phone: profile?.phone,
        email: profile?.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        businessName: profile?.business_name,
      });
    }
  }, []);

  return (
    <main className="max-w-lg m-auto">
      <TableFlowProgress />
      <AnimatePresence mode="wait">
        {currentView === TableView.Table && (
          <motion.div
            key="all-tables"
            exit={{ opacity: 0, y: 3, transition: { duration: 0.5 } }}
          >
            <AllTables tables={tables} />
          </motion.div>
        )}
        {currentView === TableView.Application && (
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
        {currentView === TableView.Complete && <Complete />}
      </AnimatePresence>
    </main>
  );
}
