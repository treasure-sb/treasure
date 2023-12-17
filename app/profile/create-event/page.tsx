"use client";
import { useState } from "react";
import CreateEventStepOne from "./CreateEventStepOne";
import CreateEventStepTwo from "./CreateEventStepTwo";
import CreateEventStepThree from "./CreateEventStepThree";
import CreateEventStepFour from "./CreateEventStepFour";
import CreateEventStepFive from "./CreateEventStepFive";
import CreateEventTables from "./CreateEventTables";
import { EventForm } from "@/types/event";

export default function Page() {
  const [step, setStep] = useState(1);
  const [eventForm, setEventForm] = useState<EventForm>({
    name: "",
    description: "",
    venue_name: "",
    address: "",
    lat: 0,
    lng: 0,
    date: undefined,
    start_time: "09:30",
    end_time: "16:30",
    tickets: [
      {
        ticket_price: "",
        ticket_quantity: "",
        ticket_name: "",
      },
    ],
    tables: [
      {
        table_price: "",
        table_quantity: "",
      },
    ],
    tags: [],
    poster_url: undefined,
    venue_map_url: undefined,
  });

  const progress = Array.from({ length: 6 }, (_, i) => (
    <div
      className={`rounded-full w-2 h-2 transition duration-500 ${
        step === i + 1 ? "bg-primary" : "bg-secondary"
      }`}
    />
  ));

  return (
    <main className="max-w-lg h-[calc(100vh-300px)] m-auto">
      <div className="space-y-2 mb-4">
        <div className="flex justify-between mx-10 mb-4">{progress}</div>
        <h1 className="text-3xl font-semibold">Create Event</h1>
      </div>
      {step === 1 && (
        <CreateEventStepOne
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
        />
      )}
      {step === 2 && (
        <CreateEventStepTwo
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 3 && (
        <CreateEventStepThree
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 4 && (
        <CreateEventTables
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 5 && (
        <CreateEventStepFour
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
      {step === 6 && (
        <CreateEventStepFive
          eventForm={eventForm}
          onBack={() => setStep(step - 1)}
        />
      )}
    </main>
  );
}
