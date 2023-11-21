"use client";
import { useState } from "react";
import CreateEventStepOne from "@/components/events/create-event/CreateEventStepOne";
import CreateEventStepTwo from "@/components/events/create-event/CreateEventStepTwo";
import CreateEventStepThree from "@/components/events/create-event/CreateEventStepThree";
import CreateEventStepFour from "@/components/events/create-event/CreateEventStepFour";
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
    start_time: "",
    end_time: "",
    tickets: [
      {
        ticket_price: "",
        ticket_quantity: "",
      },
    ],
    poster_url: undefined,
  });

  return (
    <main className="max-w-lg h-[calc(100vh-220px)] m-auto">
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
