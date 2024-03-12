import EventInformation from "./steps/EventInformation";
import VendorInformation from "./steps/VendorInformation";
import Submitted from "./steps/Submitted";
import TableInformation from "./steps/TableInformation";
import TermsAndConditions from "./steps/TermsAndConditions";
import ReviewInformation from "./steps/ReviewInformation";
import { Tables } from "@/types/supabase";
import { useVendorApplicationStore } from "./store";

export default function VendorApplication({
  event,
  table,
  handleOpenChange,
  tables,
  prebooked,
}: {
  event: Tables<"events">;
  table: Tables<"tables">;
  tables: Tables<"tables">[];
  prebooked: boolean;
  handleOpenChange: () => void;
}) {
  const { currentStep } = useVendorApplicationStore();

  return (
    <div className="flex flex-col justify-between h-[80%] md:h-[90%] overflow-scroll scrollbar-hidden">
      {currentStep === 1 && <EventInformation event={event} />}
      {currentStep === 2 && (
        <TableInformation table={table} tables={tables} prebooked={prebooked} />
      )}
      {currentStep === 3 && <VendorInformation />}
      {currentStep === 4 && <TermsAndConditions event={event} />}
      {currentStep === 5 && (
        <ReviewInformation
          event={event}
          table={table}
          tables={tables}
          prebooked={prebooked}
        />
      )}
      {currentStep === 6 && (
        <Submitted handleOpenChange={handleOpenChange} prebooked={prebooked} />
      )}
    </div>
  );
}
