import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import BasicEventInfo from "./BasicEventInfo";
import PromoCodes from "./PromoCodes";
import TablesInfo from "./TablesInfo";
import TicketsInfo from "./TicketsInfo";
import Link from "next/link";

export default async function GeneralInfo({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  const tickets = ticketsData as Tables<"tickets">[];

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id);

  const tables = tablesData as Tables<"tables">[];

  const { data: codesData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", event.id);

  const codes = codesData as Tables<"event_codes">[];

  return (
    <Accordion type="single" collapsible className="flex flex-col gap-8 mt-6">
      <AccordionItem value="item-1" className="border rounded-sm px-6 py-2">
        <AccordionTrigger className="text-lg text-left md:text-2xl decoration-background">
          Basic Event Info
        </AccordionTrigger>
        <AccordionContent className="text-base md:text-xl">
          <BasicEventInfo event={event} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border rounded-sm px-6 py-2">
        <AccordionTrigger className="text-lg text-left md:text-2xl decoration-background">
          Tickets
        </AccordionTrigger>
        <AccordionContent className="text-base md:text-xl">
          <TicketsInfo tickets={tickets} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border rounded-sm px-6 py-2">
        <AccordionTrigger className="text-lg text-left md:text-2xl decoration-background">
          Tables
        </AccordionTrigger>
        <AccordionContent className="text-base md:text-xl">
          <TablesInfo tables={tables} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4" className="border rounded-sm px-6 py-2">
        <AccordionTrigger className="text-lg text-left md:text-2xl decoration-background">
          Promo Codes
        </AccordionTrigger>
        <AccordionContent className="text-base md:text-xl">
          <PromoCodes codes={codes} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
