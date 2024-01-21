import { create } from "zustand";
import { Tables } from "@/types/supabase";

type VendorApplicationStore = {
  applicationDialogOpen: boolean;
  currentStep: number;
  tableQuantity: number;
  vendorsAtTable: number;
  inventory: string;
  comments: string;
  event: Tables<"events"> | null;
  table: Tables<"tables"> | null;
  termsChecked: boolean;
  setApplicationDialogOpen: (open: boolean) => void;
  setCurrentStep: (step: number) => void;
  setEvent: (event: Tables<"events">) => void;
  setTable: (table: Tables<"tables">) => void;
  setTableQuantity: (quantity: number) => void;
  setVendorsAtTable: (quantity: number) => void;
  setInventory: (inventory: string) => void;
  setComments: (comments: string) => void;
  setTermsChecked: (checked: boolean) => void;
};

export const useVendorApplicationStore = create<VendorApplicationStore>(
  (set) => ({
    applicationDialogOpen: false,
    currentStep: 1,
    event: null,
    table: null,
    tableQuantity: 0,
    vendorsAtTable: 0,
    inventory: "",
    comments: "",
    termsChecked: false,
    setApplicationDialogOpen: (open: boolean) => {
      set((state) => ({
        ...state,
        applicationDialogOpen: open,
      }));
    },
    setCurrentStep: (step: number) => {
      set((state) => ({
        ...state,
        currentStep: step,
      }));
    },
    setEvent: (event: Tables<"events">) => {
      set((state) => ({
        ...state,
        event,
      }));
    },
    setTable: (table: Tables<"tables">) => {
      set((state) => ({
        ...state,
        table,
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
    applicationDialogOpen: false,
    currentStep: 1,
    event: null,
    table: null,
    tableQuantity: 0,
    vendorsAtTable: 0,
    inventory: "",
    comments: "",
    termsChecked: false,
  });
};
