import { Tables } from "@/types/supabase";
import { TableView } from "./context/VendorFlowContext";
import { EventDisplayData } from "@/types/event";

type Link = {
  username: string;
  application: string;
};

type ProfileWithInstagram = Tables<"profiles"> & {
  instagram?: string;
};

type VendorFlowState = {
  currentView: TableView;
  event: EventDisplayData;
  generalVendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: ProfileWithInstagram | null;
  tables: Tables<"tables">[];
};

type VendorApplicationState = {
  currentStep: number;
  vendorInfo: VendorInfo;
  table: Tables<"tables">;
  inventory: string;
  comments: string;
  tableQuantity: number;
  vendorsAtTable: number;
  termsAccepted: boolean;
};

type VendorInfo = {
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  instagram?: string | null;
};

type VendorApplication = {
  event_id: string;
  vendor_id: string;
  table_id: string;
  application_phone: string;
  application_email: string;
  table_quantity: number;
  vendors_at_table: number;
  inventory: string;
  comments: string;
};

export type {
  Link,
  ProfileWithInstagram,
  VendorFlowState,
  VendorApplicationState,
  VendorInfo,
  VendorApplication,
};
