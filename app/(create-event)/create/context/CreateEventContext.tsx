import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useReducer } from "react";

export enum CurrentStep {
  STEP_ONE = 1,
  STEP_TWO = 2,
}

export type CreateEventState = {
  currentStep: CurrentStep;
  tags: Tables<"tags">[];
  user: User | null;
};
type CreateEventActions =
  | { type: "setCurrentStep"; payload: CurrentStep }
  | { type: "setUser"; payload: User | null };

type CreateEventContextType = {
  state: CreateEventState;
  dispatch: React.Dispatch<CreateEventActions>;
};

const initialState = {
  currentStep: CurrentStep.STEP_ONE,
  tags: [],
  user: null,
};

const reducer = (state: CreateEventState, action: CreateEventActions) => {
  switch (action.type) {
    case "setCurrentStep":
      return { ...state, currentStep: action.payload };
    case "setUser":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const CreateEventContext = createContext<CreateEventContextType>({
  state: initialState,
  dispatch: () => null,
});

export const CreateEventProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: CreateEventState;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CreateEventContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateEventContext.Provider>
  );
};

export const useCreateEvent = () => {
  const { state, dispatch } = useContext(CreateEventContext);
  return { ...state, dispatch };
};
