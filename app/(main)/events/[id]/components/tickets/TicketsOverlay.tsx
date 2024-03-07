"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
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
import BackButton from "@/components/ui/custom/back-button";
import TicketCounter from "./TicketCounter";

interface TicketInfoProps {
  type: string;
  price: number;
}

const TicketInfo = ({ type, price }: TicketInfoProps) => (
  <div className="flex space-x-4">
    <TicketIcon className="stroke-1 text-tertiary" />
    <div className="flex">
      <p>{type}</p> <p className="ml-2 font-bold">${price}</p>
    </div>
  </div>
);

export default function TicketsOverlay({
  goBack,
  eventDisplayData,
  tickets,
  user,
}: {
  goBack: () => void;
  eventDisplayData: EventDisplayData;
  tickets: Tables<"tickets">[];
  user: User | null;
}) {
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    document.body.style.overflow = "hidden";
    document.body.addEventListener("touchmove", preventScroll, {
      passive: false,
    });

    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  const ticketsOptions = tickets.map((ticket, index) => (
    <AccordionItem className="p-2" key={index} value={`item-${index}`}>
      <AccordionTrigger className="decoration-primary">
        <TicketInfo type={ticket.name} price={ticket.price} />
      </AccordionTrigger>
      <AccordionContent className="px-6">
        <TicketCounter
          ticket={ticket}
          user={user}
          eventDisplayData={eventDisplayData}
        />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <motion.div
      exit={{ opacity: 0, y: 5, transition: { duration: 0.2 } }}
      className="fixed inset-0 bg-black bg-opacity-[0.97] z-50 p-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 0.6, ease: "easeInOut" },
        }}
        exit={{ opacity: 0, y: 5, transition: { duration: 0.2 } }}
        className="max-w-lg m-auto mt-20 md:mt-40"
      >
        <BackButton onClose={goBack} />
        <EventCard
          event={eventDisplayData}
          clickable={false}
          showLikeButton={false}
        />
        <Accordion className="mt-10" type="single" collapsible>
          {ticketsOptions}
        </Accordion>
      </motion.div>
    </motion.div>
  );
}
