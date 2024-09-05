import { Button } from "@/components/ui/button";
import CreateEventCard from "./CreateEventCard";
import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { PlusIcon } from "lucide-react";

export default function EventDates() {
  const EventDatesFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button variant={"outline"} className="space-x-2 text-xs rounded-full">
        <PlusIcon size={18} />
        <span>Add Another Date</span>
      </Button>
    </div>
  );

  return (
    <CreateEventCard title="Event Dates" footer={EventDatesFooter}>
      <div className="space-y-2">
        <InputWithLabel label="Date" type="date" />
        <div className="flex space-x-2">
          <InputWithLabel label="Start Time" type="time" />
          <InputWithLabel label="End Time" type="time" />
        </div>
      </div>
    </CreateEventCard>
  );
}
