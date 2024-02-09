import { create } from "zustand";

type VendorApplicationStore = {
  currentStep: number;
  tableQuantity: number;
  vendorsAtTable: number;
  inventory: string;
  comments: string;
  termsChecked: boolean;
  tableNumber: number;
  setTableNumber: (tableNumber: number) => void;
  setCurrentStep: (step: number) => void;
  setTableQuantity: (quantity: number) => void;
  setVendorsAtTable: (quantity: number) => void;
  setInventory: (inventory: string) => void;
  setComments: (comments: string) => void;
  setTermsChecked: (checked: boolean) => void;
};

export const useVendorApplicationStore = create<VendorApplicationStore>(
  (set) => ({
    currentStep: 1,
    tableQuantity: 0,
    vendorsAtTable: 0,
    inventory: "",
    comments: "",
    termsChecked: false,
    tableNumber: -1,
    setTableNumber: (tableNumber: number) => {
      set((state) => ({
        ...state,
        tableNumber,
      }));
    },
    setCurrentStep: (step: number) => {
      set((state) => ({
        ...state,
        currentStep: step,
      }));
    },
    setTableQuantity: (quantity: number) => {
      set((state) => ({
        ...state,
        tableQuantity: quantity,
      }));
    },
    setVendorsAtTable: (quantity: number) => {
      set((state) => ({
        ...state,
        vendorsAtTable: quantity,
      }));
    },
    setInventory: (inventory: string) => {
      set((state) => ({
        ...state,
        inventory,
      }));
    },
    setComments: (comments: string) => {
      set((state) => ({
        ...state,
        comments,
      }));
    },
    setTermsChecked: (checked: boolean) => {
      set((state) => ({
        ...state,
        termsChecked: checked,
      }));
    },
  })
);

export const resetApplication = () => {
  useVendorApplicationStore.setState({
    currentStep: 1,
    tableQuantity: 0,
    vendorsAtTable: 0,
    inventory: "",
    comments: "",
    termsChecked: false,
  });
};
