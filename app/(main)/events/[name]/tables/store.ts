import { Tables } from "@/types/supabase";
import { create } from "zustand";

export enum TableView {
  ALL_TABLES = "ALL_TABLES",
  APPLICATION = "APPLICATION",
}

type VendorFlowStore = {
  currentView: TableView;
  vendorInfo: Tables<"application_vendor_information">;
  setCurrentView: (view: TableView) => void;
  setVendorInfo: (vendorInfo: Tables<"application_vendor_information">) => void;
};

export const useVendorFlowStore = create<VendorFlowStore>((set) => ({
  currentView: TableView.ALL_TABLES,
  vendorInfo: {} as Tables<"application_vendor_information">,
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
}));
