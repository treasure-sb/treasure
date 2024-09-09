import React, { createContext, useContext, useReducer } from "react";

export enum CurrentStep {
  STEP_ONE = 1,
  STEP_TWO = 2,
}

type CreateEventState = {
  currentStep: CurrentStep;
};
type CreateEventActions = { type: "setCurrentStep"; payload: CurrentStep };

type CreateEventContextType = {
  state: CreateEventState;
  dispatch: React.Dispatch<CreateEventActions>;
};

const initialState = {
  currentStep: CurrentStep.STEP_ONE,
};

const reducer = (state: CreateEventState, action: CreateEventActions) => {
  switch (action.type) {
    case "setCurrentStep":
      return { ...state, currentStep: action.payload };
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
}: {
  children: React.ReactNode;
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
