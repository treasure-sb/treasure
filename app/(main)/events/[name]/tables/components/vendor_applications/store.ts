import { create } from "zustand";

type VendorApplicationStore = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export const useVendorApplicationStore = create<VendorApplicationStore>(
  (set) => ({
    currentStep: 1,
    setCurrentStep: (step) => set({ currentStep: step }),
  })
);
