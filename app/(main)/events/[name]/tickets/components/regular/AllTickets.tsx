import { EventDisplayData } from "@/types/event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tables } from "@/types/supabase";
import { TicketInfo } from "../TicketInfo";
import { User } from "@supabase/supabase-js";
import EventCard from "@/components/events/shared/EventCard";
import TicketCounter from "./TicketCounter";

export default function AllTickets({
  event,
  tickets,
  user,
}: {
  event: EventDisplayData;
  tickets: Tables<"tickets">[];
  user: User | null;
}) {
  const ticketsOptions = tickets.map((ticket, index) => (
    <AccordionItem className="p-4" key={index} value={`item-${index}`}>
      <AccordionTrigger className="decoration-background text-background">
        <TicketInfo type={ticket.name} price={ticket.price} />
      </AccordionTrigger>
      <AccordionContent className="px-6 py-2">
        {ticket.description !== null && <p className="text-black text-center flex mb-4">{ticket.description}</p>}
        <TicketCounter ticket={ticket} user={user} event={event} />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <div className="mt-10">
      <EventCard event={event} clickable={false} showLikeButton={false} />
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
