"use client";

import Exit from "./sections/Exit";
import EventPoster from "./sections/EventPoster";
import EventDetails from "./sections/EventDetails";
import EventDates from "./sections/EventDates";
import EventTickets from "./sections/EventTickets";
import EventTables from "./sections/EventTables";
import MenuBar from "./MenuBar";
import { Form } from "@/components/ui/form";
import { eventSchema, type CreateEvent } from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateEventForm() {
  const initialState: CreateEvent = {
    basicDetails: {
      name: "",
      venueName: "",
      description: "",
    },
    dates: [{ date: undefined, startTime: "", endTime: "" }],
    tickets: [{ name: "", description: "", price: "", quantity: "" }],
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
    <FormProvider {...form}>
      <Form {...form}>
        <form>
          <div className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
            <Exit />
            <div className="w-full flex flex-col space-y-4 lg:flex-row-reverse lg:space-y-0 lg:justify-between">
              <EventPoster />
              <div className="space-y-4 w-full lg:pr-10 lg:space-y-10">
                <EventDetails />
                <EventDates />
                <EventTickets />
                <EventTables />
              </div>
            </div>
          </div>
          <MenuBar />
        </form>
      </Form>
    </FormProvider>
  );
}
