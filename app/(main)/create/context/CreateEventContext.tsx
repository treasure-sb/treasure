import React, { createContext, useContext, useReducer } from "react";
import { eventSchema, type Event } from "./schema";

const EventContext = createContext<Event>({} as Event);

const EventContextProvider = ({
  children,
  form,
}: {
  children: React.ReactNode;
  form: Event;
}) => {
  return <EventContext.Provider value={form}>{children}</EventContext.Provider>;
};

const useEventContext = () => {
  return useContext(EventContext);
};

export { EventContextProvider, useEventContext };
