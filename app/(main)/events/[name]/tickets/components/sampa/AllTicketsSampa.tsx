"use client";

import { EventDisplayData } from "@/types/event";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TicketInfo } from "../TicketInfo";
import EventCard from "@/components/events/shared/EventCard";
import TicketCounterSampa from "./TicketCounterSampa";
import DinnerSelection from "./DinnerSelection";
import { cn } from "@/lib/utils";

enum TicketView {
  TICKETS,
  DINNER,
}

export default function AllTicketsSampa({
  event,
  tickets,
  user,
}: {
  event: EventDisplayData;
  tickets: Tables<"tickets">[];
  user: User | null;
}) {
  const [sampaStep, setSampaStep] = useState(TicketView.TICKETS);
  const [ticketSelected, setTicketSelected] =
    useState<Tables<"tickets"> | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleGoToDinnerSelection = () => {
    setSampaStep(TicketView.DINNER);
  };

  const handleGoBackToTickets = () => {
    setSampaStep(TicketView.TICKETS);
  };

  const handleTicketSelection = (ticket: Tables<"tickets">) => {
    setTicketSelected(ticket);
  };

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
  };

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
          <p className="text-black text-center flex mb-4">
            {ticket.description}
          </p>
        )}
        <TicketCounterSampa
          ticket={ticket}
          user={user}
          goToDinner={handleGoToDinnerSelection}
          onTicketSelection={handleTicketSelection}
          updateQuantity={handleQuantityChange}
        />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <AnimatePresence mode="wait">
      {sampaStep === TicketView.TICKETS ? (
        <motion.div
          key="tickets"
          className="mt-10"
          exit={{ opacity: 0, y: 3, transition: { duration: 0.5 } }}
        >
          <EventCard event={event} clickable={false} showLikeButton={false} />
          <Accordion
            className="mt-10 mb-4 dark:bg-foreground border-[1px] border-foreground dark:border-none rounded-md"
            type="single"
            defaultValue="item-0"
            collapsible
          >
            {ticketsOptions}
          </Accordion>
        </motion.div>
      ) : (
        <motion.div
          key="dinner"
          initial={{ opacity: 0, y: 3 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
        >
          <DinnerSelection
            ticket={ticketSelected!}
            quantity={quantity}
            goBackToTickets={handleGoBackToTickets}
            user={user}
            event={event}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
