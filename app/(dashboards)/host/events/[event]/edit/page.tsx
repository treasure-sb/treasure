import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PromoCodes from "./components/PromoCodes";
import { Tables } from "@/types/supabase";
import BasicEventInfo from "./components/BasicEventInfo";
import TicketsInfo from "./components/TicketsInfo";
import TablesInfo from "./components/TablesInfo";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventID } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", event)
    .single();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const tickets = ticketsData as Tables<"tickets">[];

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const tables = tablesData as Tables<"tables">[];

  const { data: codesData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const codes = codesData as Tables<"event_codes">[];

  return (
    <main>
      <Accordion type="single" collapsible className="flex flex-col gap-8">
        <AccordionItem value="item-1" className="border rounded-sm px-6 py-2">
          <AccordionTrigger className="text-lg text-left md:text-2xl decoration-background">
            Basic Event Info
          </AccordionTrigger>
          <AccordionContent className="text-base md:text-xl">
            <BasicEventInfo event={eventID} />
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
    </main>
  );
}
