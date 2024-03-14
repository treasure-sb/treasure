import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { create } from "zustand";

export enum TableView {
  Table = 1,
  Application = 2,
  Complete = 3,
}

type VendorFlowStore = {
  currentView: TableView;
  event: EventDisplayData;
  vendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: Tables<"profiles"> | null;
  setCurrentView: (view: TableView) => void;
  setVendorInfo: (vendorInfo: Tables<"application_vendor_information">) => void;
  setProfile: (profile: Tables<"profiles">) => void;
  setTerms: (terms: Tables<"application_terms_and_conditions">[]) => void;
  setEvent: (event: EventDisplayData) => void;
};

export const useVendorFlowStore = create<VendorFlowStore>((set) => ({
  currentView: TableView.Table,
  event: {} as EventDisplayData,
  vendorInfo: {} as Tables<"application_vendor_information">,
  profile: null,
  terms: [],
  setCurrentView: (view: TableView) => {
    set((state) => ({
      ...state,
      currentView: view,
    }));
  },
  setVendorInfo: (vendorInfo: Tables<"application_vendor_information">) => {
    set((state) => ({
      ...state,
      vendorInfo,
    }));
  },
  setProfile: (profile: Tables<"profiles">) => {
    set((state) => ({
      ...state,
      profile,
    }));
  },
  setTerms: (terms: Tables<"application_terms_and_conditions">[]) => {
    set((state) => ({
      ...state,
      terms,
    }));
  },
  setEvent: (event: EventDisplayData) => {
    set((state) => ({
      ...state,
      event,
    }));
  },
}));
