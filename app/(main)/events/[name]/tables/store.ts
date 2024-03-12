import { create } from "zustand";

export enum TableView {
  ALL_TABLES = "ALL_TABLES",
  APPLICATION = "APPLICATION",
}

type VendorFlowStore = {
  currentView: TableView;
  setCurrentView: (view: TableView) => void;
};

export const useVendorFlowStore = create<VendorFlowStore>((set) => ({
  currentView: TableView.ALL_TABLES,
  setCurrentView: (view: TableView) => {
    set((state) => ({
      ...state,
      currentView: view,
    }));
  },
}));
