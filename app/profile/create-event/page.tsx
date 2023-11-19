"use client";
import { useState } from "react";
import CreateEventStepOne from "@/components/events/CreateEventStepOne";
import CreateEventStepTwo from "@/components/events/CreateEventStepTwo";
import CreateEventStepThree from "@/components/events/CreateEventStepThree";
import CreateEventStepFour from "@/components/events/CreateEventStepFour";
import { EventForm } from "@/types/event";

export default function Page() {
  const [step, setStep] = useState(1);
  const [eventForm, setEventForm] = useState<EventForm>({
    name: "",
    description: "",
    venueName: "",
    venueAddress: "",
    date: undefined,
    startTime: "",
    endTime: "",
    ticketPrice: "",
    ticketQuantity: "",
    poster: undefined,
  });

  return (
    <main className="max-w-lg h-[calc(100vh-120px)] m-auto">
      <h1 className="text-3xl font-semibold mb-6">Create Event</h1>
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
        <CreateEventStepFour
          eventForm={eventForm}
          setEventForm={setEventForm}
          onNext={() => setStep(step + 1)}
          onBack={() => setStep(step - 1)}
        />
      )}
    </main>
  );
}
