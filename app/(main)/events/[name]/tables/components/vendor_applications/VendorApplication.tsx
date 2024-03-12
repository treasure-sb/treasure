"use client";
import { motion } from "framer-motion";
import { EventDisplayData } from "@/types/event";
import { useVendorApplicationStore } from "./store";
import { TableView, useVendorFlowStore } from "../../store";
import EventInformation from "./EventInformation";
import BackButton from "@/components/ui/custom/back-button";

export default function VendorApplication({
  event,
}: {
  event: EventDisplayData;
}) {
  const { currentStep } = useVendorApplicationStore();
  const { setCurrentView } = useVendorFlowStore();

  return (
    <>
      <BackButton
        onClick={() => {
          setCurrentView(TableView.ALL_TABLES);
        }}
      />
      <h2 className="text-2xl font-semibold mb-4">Vendor Application</h2>
      {currentStep === 1 && <EventInformation event={event} />}
    </>
  );
}
