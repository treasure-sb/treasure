"use client";

import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { VendorFlowProvider, TableView } from "../context/VendorFlowContext";
import { VendorApplicationProvider } from "../context/VendorApplicationContext";
import type {
  ProfileWithInstagram,
  VendorFlowState,
  VendorApplicationState,
  VendorInfo,
} from "../types";
import TableFlow from "./TableFlow";

export default function TableFlowConsumer({
  eventDisplay,
  tables,
  generalVendorInfo,
  terms,
  tags,
  profile,
}: {
  eventDisplay: EventDisplayData;
  tables: Tables<"tables">[];
  generalVendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  tags: Tables<"tags">[];
  profile: ProfileWithInstagram | null;
}) {
  const initialVendorFlowState: VendorFlowState = {
    currentView: TableView.Table,
    event: eventDisplay,
    generalVendorInfo,
    terms,
    tags,
    profile,
    tables,
  };

  const initalVendorApplicationState: VendorApplicationState = {
    currentStep: 1,
    vendorInfo: {} as VendorInfo,
    table: {} as Tables<"tables">,
    inventory: "",
    comments: "",
    tableQuantity: 0,
    vendorTags: [],
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
