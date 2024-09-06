"use client";

import { CreateEventProvider } from "../context/CreateEventContext";
import { Form } from "@/components/ui/form";
import { eventSchema, type CreateEvent } from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Exit from "./sections/Exit";
import MenuBar from "./MenuBar";
import CreateEventFormSections from "./CreateEventFormSections";

export default function CreateEventForm() {
  const initialState: CreateEvent = {
    basicDetails: {
      name: "",
      venueName: "",
      description: "",
    },
    dates: [{ date: undefined, startTime: "", endTime: "" }],
    tickets: [{ name: "GA", description: "", price: "0", quantity: "100" }],
    tables: [
      {
        name: "",
        price: "",
        quantity: "",
        tableProvided: false,
        spaceAllocated: "",
        numberVendorsAllowed: "",
        additionalInformation: "",
      },
    ],
  };

  const form = useForm<CreateEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  return (
    <CreateEventProvider>
      <FormProvider {...form}>
        <Form {...form}>
          <form className="pb-10">
            <div className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
              <Exit />
              <CreateEventFormSections />
            </div>
            <MenuBar />
          </form>
        </Form>
      </FormProvider>
    </CreateEventProvider>
  );
}
