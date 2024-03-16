"use client";
import { AnimatePresence, motion } from "framer-motion";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  TableView,
  VendorFlowProvider,
  VendorFlowState,
  useVendorFlow,
} from "../context/VendorFlowContext";
import {
  VendorApplicationProvider,
  VendorApplicationState,
  type VendorInfo,
} from "../context/VendorApplicationContext";
import TableFlowProgress from "./TableFlowProgress";
import Complete from "./vendor_applications/steps/Complete";
import VendorApplication from "./vendor_applications/VendorApplication";
import AllTables from "./all_tables/AllTables";

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
  const { state: flowState } = useVendorFlow();
  const { currentView } = flowState;

  const initialVendorFlowState: VendorFlowState = {
    currentView: TableView.Table,
    event: eventDisplay,
    generalVendorInfo: vendorInfo,
    terms,
    profile,
  };

  let initVendorInfo;
  if (profile) {
    initVendorInfo = {
      phone: profile?.phone,
      email: profile?.email,
      firstName: profile?.first_name,
      lastName: profile?.last_name,
      businessName: profile?.business_name,
    };
  } else {
    initVendorInfo = {} as VendorInfo;
  }

  const initalVendorApplicationState: VendorApplicationState = {
    currentStep: 1,
    vendorInfo: initVendorInfo,
    table: {} as Tables<"tables">,
    inventory: "",
    comments: "",
    tableQuantity: 0,
    vendorsAtTable: 0,
    termsAccepted: false,
  };

  return (
    <main className="max-w-lg m-auto">
      <VendorFlowProvider initialState={initialVendorFlowState}>
        <VendorApplicationProvider initialState={initalVendorApplicationState}>
          <TableFlowProgress />
          <AnimatePresence mode="wait" key={currentView}>
            {currentView === TableView.Table && (
              <motion.div
                key="all-tables"
                exit={{ opacity: 0, y: 3, transition: { duration: 0.5 } }}
              >
                <AllTables tables={tables} event={eventDisplay} />
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
        </VendorApplicationProvider>
      </VendorFlowProvider>
    </main>
  );
}
