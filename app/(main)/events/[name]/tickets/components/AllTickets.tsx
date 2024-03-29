import { EventDisplayData } from "@/types/event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tables } from "@/types/supabase";
import { TicketIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import EventCard from "@/components/events/shared/EventCard";
import TicketCounter from "./TicketCounter";

interface TicketInfoProps {
  type: string;
  price: number;
}

const TicketInfo = ({ type, price }: TicketInfoProps) => (
  <div className="flex space-x-4 text-background">
    <TicketIcon className="stroke-2 text-background" />
    <div className="flex">
      <p>{type}</p> <p className="ml-2 font-bold">${price}</p>
    </div>
  </div>
);

export default function AllTickets({
  eventDisplayData,
  tickets,
  user,
}: {
  eventDisplayData: EventDisplayData;
  tickets: Tables<"tickets">[];
  user: User | null;
}) {
  const ticketsOptions = tickets.map((ticket, index) => (
    <AccordionItem className="p-4" key={index} value={`item-${index}`}>
      <AccordionTrigger className="decoration-background text-background">
        <TicketInfo type={ticket.name} price={ticket.price} />
      </AccordionTrigger>
      <AccordionContent className="px-6 py-2">
        <TicketCounter
          ticket={ticket}
          user={user}
          eventDisplayData={eventDisplayData}
        />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <div className="mt-10">
      <EventCard
        event={eventDisplayData}
        clickable={false}
        showLikeButton={false}
      />
      <Accordion
        className="mt-10 mb-4 bg-foreground rounded-md"
        type="single"
        defaultValue="item-0"
        collapsible
      >
        {ticketsOptions}
      </Accordion>
    </div>
  );
}
