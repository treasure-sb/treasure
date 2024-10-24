import React, { createContext, useContext, useReducer } from "react";
import { Tables } from "@/types/supabase";
import type { VendorInfo, VendorApplicationState } from "../types";
import { LiveTable } from "@/types/tables";

type VendorApplicationActions =
  | { type: "setTable"; payload: LiveTable }
  | { type: "setTableQuantity"; payload: number }
  | { type: "setVendorsAtTable"; payload: number }
  | { type: "setCurrentStep"; payload: number }
  | { type: "setInventory"; payload: string }
  | { type: "setComments"; payload: string }
  | { type: "setTermsAccepted"; payload: boolean }
  | { type: "resetApplication" }
  | { type: "setVendorInfo"; payload: VendorInfo }
  | { type: "setVendorTags"; payload: Tables<"tags">[] };

type VendorApplicationContextType = {
  applicationState: VendorApplicationState;
  applicationDispatch: React.Dispatch<VendorApplicationActions>;
};

const initialState: VendorApplicationState = {
  currentStep: 1,
  vendorInfo: {} as VendorInfo,
  table: {} as LiveTable,
  inventory: "",
  comments: "",
  tableQuantity: 0,
  vendorsAtTable: 0,
  vendorTags: [],
  termsAccepted: false,
};

const reducer = (
  state: VendorApplicationState,
  action: VendorApplicationActions
) => {
  switch (action.type) {
    case "setTable":
      return { ...state, table: action.payload };
    case "setTableQuantity":
      return { ...state, tableQuantity: action.payload };
    case "setVendorsAtTable":
      return { ...state, vendorsAtTable: action.payload };
    case "setCurrentStep":
      return { ...state, currentStep: action.payload };
    case "setInventory":
      return { ...state, inventory: action.payload };
    case "setComments":
      return { ...state, comments: action.payload };
    case "setTermsAccepted":
      return { ...state, termsAccepted: action.payload };
    case "setVendorInfo":
      return { ...state, vendorInfo: action.payload };
    case "setVendorTags":
      return { ...state, vendorTags: action.payload };
    case "resetApplication":
      return initialState;
  }
};

const VendorApplicationContext = createContext<VendorApplicationContextType>({
  applicationState: initialState,
  applicationDispatch: () => null,
});

export const VendorApplicationProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: VendorApplicationState;
}) => {
  const [applicationState, applicationDispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <VendorApplicationContext.Provider
      value={{ applicationState, applicationDispatch }}
    >
      {children}
    </VendorApplicationContext.Provider>
  );
};

export const useVendorApplication = () => {
  const { applicationState, applicationDispatch } = useContext(
    VendorApplicationContext
  );
  return { ...applicationState, applicationDispatch };
};
