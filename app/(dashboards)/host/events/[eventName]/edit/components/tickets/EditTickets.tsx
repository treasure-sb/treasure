import { Tables } from "@/types/supabase";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TicketIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import createSupabaseServerClient from "@/utils/supabase/server";
import EditTicketForm from "./EditTicketForm";

interface TicketInfoProps {
  name: string;
  price: number;
}

const TicketInfo = ({ name, price }: TicketInfoProps) => (
  <div className="flex space-x-4">
    <TicketIcon className="stroke-2" />
    <div className="flex">
      <p>{name}</p> <p className="ml-2">${price}</p>
    </div>
  </div>
);

export default async function EditTickets({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  const tickets: Tables<"tickets">[] = ticketsData || [];

  const ticketItems = tickets.map((ticket, index) => {
    return (
      <AccordionItem
        value={`item-${index}`}
        key={index}
        className="border-none"
      >
        <AccordionTrigger className={cn(`decoration-background p-6`)}>
          <TicketInfo name={ticket.name} price={ticket.price} />
        </AccordionTrigger>
        <AccordionContent>
          <EditTicketForm ticket={ticket} />
        </AccordionContent>
      </AccordionItem>
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="font-semibold">Ticket Types</h2>
      {/* <Accordion type="multiple" className="rounded-md bg-secondary/20">
        {ticketItems}
      </Accordion> */}
    </div>
  );
}
