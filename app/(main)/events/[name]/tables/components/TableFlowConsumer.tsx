"use client";

import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  VendorFlowProvider,
  VendorFlowState,
  TableView,
} from "../context/VendorFlowContext";
import {
  VendorApplicationState,
  VendorInfo,
  VendorApplicationProvider,
} from "../context/VendorApplicationContext";
import TableFlow from "./TableFlow";

export default function TableFlowConsumer({
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
  const initialVendorFlowState: VendorFlowState = {
    currentView: TableView.Table,
    event: eventDisplay,
    generalVendorInfo: vendorInfo,
    terms,
    profile,
    tables,
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
    <VendorFlowProvider initialState={initialVendorFlowState}>
      <VendorApplicationProvider initialState={initalVendorApplicationState}>
        <TableFlow />
      </VendorApplicationProvider>
    </VendorFlowProvider>
  );
}
