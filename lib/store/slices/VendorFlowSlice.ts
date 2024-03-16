import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { StateCreator } from "zustand";

export enum TableView {
  Table = 1,
  Application = 2,
  Complete = 3,
}

type VendorFlowState = {
  currentView: TableView;
  event: EventDisplayData;
  generalVendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: Tables<"profiles"> | null;
};

type VendorFlowActions = {
  setCurrentView: (view: TableView) => void;
  setGeneralVendorInfo: (
    generalVendorInfo: Tables<"application_vendor_information">
  ) => void;
  setProfile: (profile: Tables<"profiles">) => void;
  setTerms: (terms: Tables<"application_terms_and_conditions">[]) => void;
  setEvent: (event: EventDisplayData) => void;
};

export type VendorFlowSlice = VendorFlowState & VendorFlowActions;

export const createVendorFlowSlice: StateCreator<
  VendorFlowSlice,
  [],
  [],
  VendorFlowSlice
> = (set) => ({
  currentView: TableView.Table,
  event: {} as EventDisplayData,
  generalVendorInfo: {} as Tables<"application_vendor_information">,
  profile: null,
  terms: [],
  setCurrentView: (view: TableView) => {
    set(() => ({
      currentView: view,
    }));
  },
  setGeneralVendorInfo: (
    generalVendorInfo: Tables<"application_vendor_information">
  ) => {
    set(() => ({
      generalVendorInfo,
    }));
  },
  setProfile: (profile: Tables<"profiles">) => {
    set(() => ({
      profile,
    }));
  },
  setTerms: (terms: Tables<"application_terms_and_conditions">[]) => {
    set(() => ({
      terms,
    }));
  },
  setEvent: (event: EventDisplayData) => {
    set(() => ({
      event,
    }));
  },
});
