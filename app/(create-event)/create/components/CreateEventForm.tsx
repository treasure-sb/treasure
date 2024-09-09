"use client";

import { CreateEventProvider } from "../context/CreateEventContext";
import { Form } from "@/components/ui/form";
import { eventSchema, type CreateEvent } from "../schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { sectionVariants } from "./CreateEventFormSections";
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
    vendorInfo: {
      checkInTime: "",
      checkInLocation: "",
      wifiAvailability: false,
      additionalInfo: "",
      terms: [{ term: "" }],
    },
  };

  const form = useForm<CreateEvent>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialState,
  });

  return (
    <CreateEventProvider>
      <FormProvider {...form}>
        <Form {...form}>
          <form className="pb-14 lg:pb-20">
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
            <MenuBar />
          </form>
        </Form>
      </FormProvider>
    </CreateEventProvider>
  );
}
