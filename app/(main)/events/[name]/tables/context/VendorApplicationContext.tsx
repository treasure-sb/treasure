import React, { createContext, useContext, useReducer } from "react";
import { Tables } from "@/types/supabase";

export type VendorApplicationState = {
  currentStep: number;
  vendorInfo: VendorInfo;
  table: Tables<"tables">;
  inventory: string;
  comments: string;
  tableQuantity: number;
  vendorsAtTable: number;
  termsAccepted: boolean;
};

export type VendorInfo = {
  phone: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  businessName: string | null;
  instagram?: string | null;
};

const initialState: VendorApplicationState = {
  currentStep: 1,
  vendorInfo: {} as VendorInfo,
  table: {} as Tables<"tables">,
  inventory: "",
  comments: "",
  tableQuantity: 0,
  vendorsAtTable: 0,
  termsAccepted: false,
};

type VendorApplicationActions =
  | { type: "setTable"; payload: Tables<"tables"> }
  | { type: "setTableQuantity"; payload: number }
  | { type: "setVendorsAtTable"; payload: number }
  | { type: "setCurrentStep"; payload: number }
  | { type: "setInventory"; payload: string }
  | { type: "setComments"; payload: string }
  | { type: "setTermsAccepted"; payload: boolean }
  | { type: "resetApplication" }
  | { type: "setVendorInfo"; payload: VendorInfo };

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
    case "resetApplication":
      return initialState;
  }
};

type VendorApplicationContextType = {
  applicationState: VendorApplicationState;
  applicationDispatch: React.Dispatch<VendorApplicationActions>;
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
