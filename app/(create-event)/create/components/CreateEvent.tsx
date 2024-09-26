"use client";

import {
  CreateEventProvider,
  CreateEventState,
  CurrentStep,
} from "../context/CreateEventContext";
import { eventSchema, type CreateEvent } from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/types/supabase";
import CreateEventOrPreview from "./CreateEventOrPreview";
import MenuBar from "./MenuBar";

export default function CreateEvent({
  tags,
  user,
  draft,
}: {
  tags: Tables<"tags">[];
  user: Tables<"profiles"> | null;
  draft: Tables<"events"> | null;
}) {
  const initialState: CreateEvent = {
    basicDetails: {
      name: draft?.name || "",
      venueName: draft?.venue_name || "",
      description: draft?.description || "",
      venueAddress: {
        address: draft?.address || "",
        lat: draft?.lat || 0,
        lng: draft?.lng || 0,
        city: draft?.city || "",
        state: draft?.state || "",
      },
    },
    dates: [{ date: undefined, startTime: "09:30", endTime: "16:30" }],
    tickets: [
      { name: "", description: "", price: "0.00", quantity: "100", dates: [] },
    ],
    tables: [
      {
        name: "",
        price: "0.00",
        quantity: "100",
        tableProvided: false,
        spaceAllocated: "",
        numberVendorsAllowed: "",
        additionalInformation: "",
      },
    ],
    vendorInfo: {
      checkInTime: "",
      checkInLocation: "",
      wifiAvailability: false,
      additionalInfo: "",
      terms: [{ term: "" }],
    },
    tags: [],
    poster: draft?.poster_url || undefined,
  };

  const form = useForm<CreateEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  const initalCreateEventState: CreateEventState = {
    currentStep: CurrentStep.STEP_ONE,
    tags: tags,
    user: user,
    preview: false,
  };

  return (
    <CreateEventProvider initialState={initalCreateEventState}>
      <FormProvider {...form}>
        <main className="min-h-screen">
          <CreateEventOrPreview form={form} />
          <MenuBar />
        </main>
      </FormProvider>
    </CreateEventProvider>
  );
}
