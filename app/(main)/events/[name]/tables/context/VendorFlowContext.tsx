import React, { createContext, useContext, useReducer } from "react";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { ProfileWithApplicationInfo, VendorFlowState } from "../types";

export enum TableView {
  Table = 1,
  Application = 2,
  Complete = 3,
}

const initialState: VendorFlowState = {
  currentView: TableView.Table,
  event: {} as EventDisplayData,
  generalVendorInfo: {} as Tables<"application_vendor_information">,
  profile: null,
  terms: [],
  tables: [],
  tags: [],
};

type VendorFlowActions =
  | { type: "setCurrentView"; payload: TableView }
  | {
      type: "setGeneralVendorInfo";
      payload: Tables<"application_vendor_information">;
    }
  | { type: "setProfile"; payload: ProfileWithApplicationInfo }
  | { type: "setTerms"; payload: Tables<"application_terms_and_conditions">[] }
  | { type: "setEvent"; payload: EventDisplayData }
  | { type: "setTags"; payload: Tables<"tags">[] };

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
    case "setTags":
      return { ...state, tags: action.payload };
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
