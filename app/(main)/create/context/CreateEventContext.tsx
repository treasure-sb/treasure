import React, { createContext, useContext, useReducer } from "react";
import { eventSchema, type Event } from "./schema";
import {
  UseFormReturn,
  useForm,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateEventContextProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: Event;
}) => {
  const form = useForm<Event>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

const useCreateEventContext = (): UseFormReturn<Event> => {
  const context = useFormContext<Event>();
  if (!context) {
    throw new Error(
      "useCreateEventContext must be used within a CreateEventContextProvider"
    );
  }
  return context;
};

export { CreateEventContextProvider, useCreateEventContext };
