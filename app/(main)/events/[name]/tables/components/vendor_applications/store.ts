import { create } from "zustand";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";

type VendorApplicationStore = {
  currentStep: number;
  event: EventDisplayData;
  table: Tables<"tables">;
  profile: Tables<"profiles"> | null;
  terms: Tables<"application_terms_and_conditions">[];
  inventory: string;
  comments: string;
  tableQuantity: number;
  vendorsAtTable: number;
  termsAccepted: boolean;
  setEvent: (event: EventDisplayData) => void;
  setTable: (table: Tables<"tables">) => void;
  setTableQuantity: (quantity: number) => void;
  setVendorsAtTable: (quantity: number) => void;
  setVendorInfo: (vendorInfo: Tables<"application_vendor_information">) => void;
  setCurrentStep: (step: number) => void;
  setProfile: (profile: Tables<"profiles">) => void;
  setInventory: (inventory: string) => void;
  setComments: (comments: string) => void;
  setTermsAccepted: (termsAccepted: boolean) => void;
  setTerms: (terms: Tables<"application_terms_and_conditions">[]) => void;
  resetApplication: () => void;
};

const initialState = {
  currentStep: 1,
  event: {} as EventDisplayData,
  table: {} as Tables<"tables">,
  terms: [{}] as Tables<"application_terms_and_conditions">[],
  profile: null,
  inventory: "",
  comments: "",
  tableQuantity: 0,
  vendorsAtTable: 0,
  termsAccepted: false,
};

export const useVendorApplicationStore = create<VendorApplicationStore>(
  (set) => ({
    ...initialState,
    setEvent: (event) => set((state) => ({ ...state, event })),
    setTable: (table) => set((state) => ({ ...state, table })),
    setTableQuantity: (tableQuantity) =>
      set((state) => ({ ...state, tableQuantity })),
    setVendorsAtTable: (vendorsAtTable) =>
      set((state) => ({ ...state, vendorsAtTable })),
    setVendorInfo: (vendorInfo) => set((state) => ({ ...state, vendorInfo })),
    setCurrentStep: (step) => set((state) => ({ ...state, currentStep: step })),
    setProfile: (profile) => set((state) => ({ ...state, profile })),
    setInventory: (inventory) => set((state) => ({ ...state, inventory })),
    setComments: (comments) => set((state) => ({ ...state, comments })),
    setTermsAccepted: (termsAccepted) =>
      set((state) => ({ ...state, termsAccepted })),
    setTerms: (terms) => set((state) => ({ ...state, terms })),
    resetApplication: () => {
      const { profile } = useVendorApplicationStore.getState();
      set(() => ({ ...initialState, profile }));
    },
  })
);
