"use client";
import { useState } from "react";
import CreateEventStepOne from "@/components/events/CreateEventStepOne";

export default function Page() {
  const [step, setStep] = useState(1);

  return (
    <main className="max-w-lg h-[calc(100vh-120px)] m-auto">
      <h1 className="text-3xl font-semibold mb-6">Create Event</h1>
      {step === 1 && <CreateEventStepOne onNext={() => setStep(step + 1)} />}
    </main>
  );
}
