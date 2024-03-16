import React, { createContext, useContext, useReducer } from "react";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";

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
  profile: Tables<"profiles"> | null;
};

const initialState: VendorFlowState = {
  currentView: TableView.Table,
  event: {} as EventDisplayData,
  generalVendorInfo: {} as Tables<"application_vendor_information">,
  profile: null,
  terms: [],
};

type VendorFlowActions =
  | { type: "setCurrentView"; payload: TableView }
  | {
      type: "setGeneralVendorInfo";
      payload: Tables<"application_vendor_information">;
    }
  | { type: "setProfile"; payload: Tables<"profiles"> }
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
  state: VendorFlowState;
  dispatch: React.Dispatch<VendorFlowActions>;
};

const VendorFlowContext = createContext<VendorFlowContextType>({
  state: initialState,
  dispatch: () => null,
});

export const VendorFlowProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: VendorFlowState;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VendorFlowContext.Provider value={{ state, dispatch }}>
      {children}
    </VendorFlowContext.Provider>
  );
};

export const useVendorFlow = () => {
  return useContext(VendorFlowContext);
};
