import EventInformation from "./steps/EventInformation";
import VendorInformation from "./steps/VendorInformation";
import Submitted from "./steps/Submitted";
import TableInformation from "./steps/TableInformation";
import TermsAndConditions from "./steps/TermsAndConditions";
import { useEffect } from "react";
import { Tables } from "@/types/supabase";
import { useVendorApplicationStore } from "./store";
import ReviewInformation from "./steps/ReviewInformation";

export default function VendorApplication({
  event,
  table,
}: {
  event: Tables<"events">;
  table: Tables<"tables">;
}) {
  const { currentStep, setEvent, setTable } = useVendorApplicationStore();
  useEffect(() => {
    setEvent(event);
  }, [event]);

  useEffect(() => {
    setTable(table);
  }, [table]);

  return (
    <div className="flex flex-col justify-between h-[80%] md:h-[90%] overflow-scroll scrollbar-hidden">
      {currentStep === 1 && <EventInformation />}
      {currentStep === 2 && <TableInformation />}
      {currentStep === 3 && <VendorInformation />}
      {currentStep === 4 && <TermsAndConditions />}
      {currentStep === 5 && <ReviewInformation />}
      {currentStep === 6 && <Submitted />}
    </div>
  );
}
