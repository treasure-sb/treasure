"use client";

import {
  CreateEventProvider,
  CreateEventState,
  CurrentStep,
} from "../context/CreateEventContext";
import { Form } from "@/components/ui/form";
import { eventSchema, type CreateEvent } from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { sectionVariants } from "./CreateEventFormSections";
import { Tables } from "@/types/supabase";
import Exit from "./sections/Exit";
import MenuBar from "./MenuBar";
import CreateEventFormSections from "./CreateEventFormSections";

export default function CreateEventForm({ tags }: { tags: Tables<"tags">[] }) {
  const initialState: CreateEvent = {
    basicDetails: {
      name: "",
      venueName: "",
      description: "",
      venueAddress: {
        address: "",
        lat: 0,
        lng: 0,
        city: "",
        state: "",
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
  };

  const form = useForm<CreateEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  const initalCreateEventState: CreateEventState = {
    currentStep: CurrentStep.STEP_ONE,
    tags: tags,
  };

  return (
    <CreateEventProvider initialState={initalCreateEventState}>
      <FormProvider {...form}>
        <Form {...form}>
          <main className="min-h-screen flex flex-col">
            <form className="pb-14 md:pb-28">
              <div className="max-w-lg lg:max-w-6xl mx-auto space-y-4">
                <div className="h-1" />
                <motion.div
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Exit />
                </motion.div>
                <CreateEventFormSections />
              </div>
            </form>
            <MenuBar />
          </main>
        </Form>
      </FormProvider>
    </CreateEventProvider>
  );
}
