import { InputWithLabel } from "@/components/ui/custom/input-with-label";
import { Button } from "@/components/ui/button";
import { Edit2Icon, PlusIcon } from "lucide-react";
import { TicketIcon } from "lucide-react";
import CreateEventCard from "./CreateEventCard";

const EventTicketDisplay = () => {
  return (
    <div className="p-4 bg-background rounded-sm font-semibold border hover:bg-secondary hover:cursor-pointer duration-300 transition relative group">
      <div className="flex">
        <TicketIcon size={24} className="text-tertiary mr-4 stroke-1" />
        <p className="mr-2">GA</p>
        <p>$0.00</p>
      </div>
      <Edit2Icon
        size={16}
        className="absolute ml-auto top-2 right-2 text-muted-foreground group-hover:text-foreground duration-300 transition"
      />
    </div>
  );
};

export default function EventTickets() {
  const EventTicketsFooter = (
    <div className="flex w-full justify-end space-x-2">
      <Button variant={"outline"} className="space-x-2 text-xs rounded-full">
        <PlusIcon size={18} />
        <span>Add Another Ticket</span>
      </Button>
    </div>
  );

  return (
    <CreateEventCard title="Event Tickets" footer={EventTicketsFooter}>
      <div className="space-y-2">
        <EventTicketDisplay />
      </div>
    </CreateEventCard>
  );
}
