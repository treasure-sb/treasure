import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { TextareaWithLabel } from "@/components/ui/custom/textarea-with-label";
import CreateEventCard from "../CreateEventCard";

export default function EventDetails() {
  return (
    <CreateEventCard title="Event Details">
      <div className="space-y-2">
        <InputWithLabel label="Event Name" placeholder="Enter the event name" />
        <InputWithLabel label="Venue Name" placeholder="Enter the venue name" />
        <TextareaWithLabel
          label="Description"
          placeholder="Add a description of your event"
        />
      </div>
    </CreateEventCard>
  );
}
