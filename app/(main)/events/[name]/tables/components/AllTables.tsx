"use clent";
import { motion, AnimatePresence } from "framer-motion";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TicketIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import TablesCounter from "./TablesCounter";
import EventCard from "@/components/events/shared/EventCard";

interface TicketInfoProps {
  type: string;
  price: number;
}

const TableInfo = ({ type, price }: TicketInfoProps) => (
  <div className="flex space-x-4 text-background">
    <TicketIcon className="stroke-2 text-background" />
    <div className="flex">
      <p>{type}</p> <p className="ml-2 font-bold">${price}</p>
    </div>
  </div>
);

export default function AllTables({
  tables,
  eventDisplay,
  user,
}: {
  tables: Tables<"tables">[];
  eventDisplay: EventDisplayData;
  user: User | null;
}) {
  const tableOptions = tables.map((table, index) => (
    <AccordionItem className="p-4" key={index} value={`item-${index}`}>
      <AccordionTrigger className="decoration-background text-background">
        <TableInfo type={table.section_name} price={table.price} />
      </AccordionTrigger>
      <AccordionContent className="px-6">
        <TablesCounter event={eventDisplay} table={table} user={user} />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <div className="mt-20 md:mt-40">
      <EventCard
        event={eventDisplay}
        clickable={false}
        showLikeButton={false}
      />
      <Accordion
        className="mt-10 bg-foreground rounded-md"
        type="single"
        collapsible
      >
        {tableOptions}
      </Accordion>
    </div>
  );
}
