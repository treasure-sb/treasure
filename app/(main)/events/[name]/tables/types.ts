import { Tables } from "@/types/supabase";
import { TableView } from "./context/VendorFlowContext";
import { EventDisplayData } from "@/types/event";

type Link = {
  username: string;
  application: string;
};

type EventTagData = {
  tag: {
    name: string;
    id: string;
  }[];
};

type ProfileWithApplicationInfo = Tables<"profiles"> & {
  instagram?: string;
  inventory?: string;
  tags?: Tables<"tags">[];
  alreadyHadInstagram?: boolean;
};

type VendorFlowState = {
  currentView: TableView;
  event: EventDisplayData;
  generalVendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  tags: Tables<"tags">[];
  profile: ProfileWithApplicationInfo | null;
  tables: Tables<"tables">[];
};

type VendorApplicationState = {
  currentStep: number;
  vendorInfo: VendorInfo;
  inventory: string;
  comments: string;
  tableQuantity: number;
  vendorsAtTable: number;
  termsAccepted: boolean;
  table: Tables<"tables">;
  vendorTags: Tables<"tags">[];
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
  EventTagData,
  ProfileWithApplicationInfo,
  VendorFlowState,
  VendorApplicationState,
  VendorInfo,
  VendorApplication,
};
