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
import { cn } from "@/lib/utils";
import { LiveTicket } from "@/types/tickets";

export default function AllTickets({
  event,
  tickets,
  user,
  embed,
  guestProfileId,
}: {
  event: EventDisplayData;
  tickets: LiveTicket[];
  user: User | null;
  embed: boolean;
  guestProfileId: string;
}) {
  const ticketsOptions = tickets.map((ticket, index) => (
    <AccordionItem
      className={cn(`p-4`, index === tickets.length - 1 && "border-b-0")}
      key={index}
      value={`item-${index}`}
    >
      <AccordionTrigger className="dark:decoration-background dark:text-background">
        <TicketInfo type={ticket.name} price={ticket.price} />
      </AccordionTrigger>
      <AccordionContent className="px-6 py-2">
        {ticket.description !== null && (
          <p className="text-black text-left flex mb-4">{ticket.description}</p>
        )}
        <TicketCounter
          ticket={ticket}
          user={user}
          event={event}
          embed={embed}
          guestProfileId={guestProfileId}
        />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <div className="mt-10">
      <EventCard event={event} clickable={false} showLikeButton={false} />
      <Accordion
        className="mt-10 mb-4 dark:bg-foreground border-[1px] border-foreground dark:border-none rounded-md"
        type="single"
        defaultValue="item-0"
        collapsible
      >
        {ticketsOptions}
      </Accordion>
    </div>
  );
}
