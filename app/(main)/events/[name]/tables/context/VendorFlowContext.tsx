import React, { createContext, useContext, useReducer } from "react";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { ProfileWithInstagram } from "../page";

export enum TableView {
  Table = 1,
  Application = 2,
  Complete = 3,
}

export type VendorFlowState = {
  currentView: TableView;
  event: EventDisplayData;
  generalVendorInfo: Tables<"application_vendor_information">;
  terms: Tables<"application_terms_and_conditions">[];
  profile: ProfileWithInstagram | null;
  tables: Tables<"tables">[];
};

const initialState: VendorFlowState = {
  currentView: TableView.Table,
  event: {} as EventDisplayData,
  generalVendorInfo: {} as Tables<"application_vendor_information">,
  profile: null,
  terms: [],
  tables: [],
};

type VendorFlowActions =
  | { type: "setCurrentView"; payload: TableView }
  | {
      type: "setGeneralVendorInfo";
      payload: Tables<"application_vendor_information">;
    }
  | { type: "setProfile"; payload: ProfileWithInstagram }
  | { type: "setTerms"; payload: Tables<"application_terms_and_conditions">[] }
  | { type: "setEvent"; payload: EventDisplayData };

const reducer = (state: VendorFlowState, action: VendorFlowActions) => {
  switch (action.type) {
    case "setCurrentView":
      return { ...state, currentView: action.payload };
    case "setGeneralVendorInfo":
      return { ...state, generalVendorInfo: action.payload };
    case "setProfile":
      return { ...state, profile: action.payload };
    case "setTerms":
      return { ...state, terms: action.payload };
    case "setEvent":
      return { ...state, event: action.payload };
    default:
      return state;
  }
};

type VendorFlowContextType = {
  flowState: VendorFlowState;
  flowDispatch: React.Dispatch<VendorFlowActions>;
};

const VendorFlowContext = createContext<VendorFlowContextType>({
  flowState: initialState,
  flowDispatch: () => null,
});

export const VendorFlowProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: VendorFlowState;
}) => {
  const [flowState, flowDispatch] = useReducer(reducer, initialState);

  return (
    <VendorFlowContext.Provider value={{ flowState, flowDispatch }}>
      {children}
    </VendorFlowContext.Provider>
  );
};

export const useVendorFlow = () => {
  const { flowState, flowDispatch } = useContext(VendorFlowContext);
  return { ...flowState, flowDispatch };
};
