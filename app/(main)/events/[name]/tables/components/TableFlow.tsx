"use client";
import { AnimatePresence, motion } from "framer-motion";
import { TableView, useVendorFlow } from "../context/VendorFlowContext";
import TableFlowProgress from "./TableFlowProgress";
import Complete from "./vendor_applications/steps/Complete";
import VendorApplication from "./vendor_applications/VendorApplication";
import AllTables from "./all_tables/AllTables";

export default function TablesFlow() {
  const { currentView } = useVendorFlow();

  return (
    <main className="max-w-lg m-auto">
      <TableFlowProgress />
      <AnimatePresence mode="wait" key={currentView}>
        {currentView === TableView.Table && (
          <motion.div
            key="all-tables"
            exit={{ opacity: 0, y: 3, transition: { duration: 0.5 } }}
          >
            <AllTables />
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
