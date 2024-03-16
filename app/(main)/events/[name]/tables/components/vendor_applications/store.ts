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
    setTable: (table) => set(() => ({ table })),
    setTableQuantity: (tableQuantity) => set(() => ({ tableQuantity })),
    setVendorsAtTable: (vendorsAtTable) => set(() => ({ vendorsAtTable })),
    setCurrentStep: (step) => set(() => ({ currentStep: step })),
    setInventory: (inventory) => set(() => ({ inventory })),
    setComments: (comments) => set(() => ({ comments })),
    setTermsAccepted: (termsAccepted) => set(() => ({ termsAccepted })),
    resetApplication: () => {
      set(() => ({ ...initialState }));
    },
    setVendorInfo: (vendorInfo) => set(() => ({ vendorInfo })),
  })
);
