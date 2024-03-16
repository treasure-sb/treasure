import { create } from "zustand";
import { Tables } from "@/types/supabase";

type VendorApplicationStore = {
  currentStep: number;
  vendorInfo: VendorInfo;
  table: Tables<"tables">;
  inventory: string;
  comments: string;
  tableQuantity: number;
  vendorsAtTable: number;
  termsAccepted: boolean;
  setTable: (table: Tables<"tables">) => void;
  setTableQuantity: (quantity: number) => void;
  setVendorsAtTable: (quantity: number) => void;
  setCurrentStep: (step: number) => void;
  setInventory: (inventory: string) => void;
  setComments: (comments: string) => void;
  setTermsAccepted: (termsAccepted: boolean) => void;
  resetApplication: () => void;
  setVendorInfo: (vendorInfo: VendorInfo) => void;
};

type VendorInfo = {
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
};

const initialState = {
  currentStep: 1,
  vendorInfo: {} as VendorInfo,
  table: {} as Tables<"tables">,
  inventory: "",
  comments: "",
  tableQuantity: 0,
  vendorsAtTable: 0,
  termsAccepted: false,
};

export const useVendorApplicationStore = create<VendorApplicationStore>(
  (set) => ({
    ...initialState,
    setTable: (table) => set((state) => ({ ...state, table })),
    setTableQuantity: (tableQuantity) =>
      set((state) => ({ ...state, tableQuantity })),
    setVendorsAtTable: (vendorsAtTable) =>
      set((state) => ({ ...state, vendorsAtTable })),
    setCurrentStep: (step) => set((state) => ({ ...state, currentStep: step })),
    setInventory: (inventory) => set((state) => ({ ...state, inventory })),
    setComments: (comments) => set((state) => ({ ...state, comments })),
    setTermsAccepted: (termsAccepted) =>
      set((state) => ({ ...state, termsAccepted })),
    resetApplication: () => {
      set(() => ({ ...initialState }));
    },
    setVendorInfo: (vendorInfo) => set((state) => ({ ...state, vendorInfo })),
  })
);
