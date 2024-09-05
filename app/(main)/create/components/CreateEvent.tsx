"use client";

import Exit from "./sections/Exit";
import EventPoster from "./sections/EventPoster";
import EventDetails from "./sections/EventDetails";
import EventDates from "./sections/EventDates";
import EventTickets from "./sections/EventTickets";
import EventTables from "./sections/EventTables";
import MenuBar from "./MenuBar";
import type { Event } from "../context/schema";
import { EventContextProvider } from "../context/CreateEventContext";

export default function CreateEvent() {
  const initialState: Event = {
    basicDetails: {
      name: "",
      venueName: "",
      description: "",
    },
    dates: [{ date: new Date(), startTime: "", endTime: "" }],
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

  return (
    <EventContextProvider initialState={initialState}>
      <main className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
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
      </main>
      <MenuBar />
    </EventContextProvider>
  );
}
