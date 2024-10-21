import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/custom/back-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { EventDisplayData } from "@/types/event";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { TicketIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LiveTicket } from "@/types/tickets";

export default function DinnerSelection({
  goBackToTickets,
  ticket,
  quantity,
  user,
  event,
}: {
  goBackToTickets: () => void;
  ticket: LiveTicket;
  quantity: number;
  user: User | null;
  event: EventDisplayData;
}) {
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const subtotal = ticket.price * quantity;

  const numDinners =
    ticket.id === "45c89043-d102-4335-9a91-5a1c00636ef2"
      ? 2 * quantity
      : quantity;

  const [dinnerSelections, setDinnerSelections] = useState<string[]>(
    Array(numDinners).fill("")
  );

  const arrayOfTickets = Array.from({ length: numDinners });

  const { push } = useRouter();

  const handleDinnerSelection = (index: number, value: string) => {
    setDinnerSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = value;
      return newSelections;
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      return;
    }
    const dinnerMap = new Map();
    dinnerSelections.forEach((selection) => {
      dinnerMap.set(selection, (dinnerMap.get(selection) || 0) + 1);
    });

    let dinnerArr = Array.from(dinnerMap.entries());
    const formatted = dinnerArr.map((dinner) => `${dinner[1]} ${dinner[0]}`);
    setCreatingCheckout(true);

    const { data, error } = await createCheckoutSession({
      event_id: event.id,
      ticket_id: ticket.id,
      ticket_type: "TICKET",
      user_id: user.id,
      quantity: quantity,
      metadata: { dinnerSelections: formatted, isSampa: true },
    });

    if (data && !error) {
      const checkoutSession: Tables<"checkout_sessions"> = data;
      push(`/checkout/${checkoutSession.id}`);
    } else {
      toast.error("Error creating checkout session");
      setCreatingCheckout(false);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <BackButton label="Back to Tickets" onClick={goBackToTickets} />
        <div>
          <h2 className="text-2xl font-semibold">Dinner Selection</h2>
          <p className="text-muted-foreground">
            Please select a dinner choice to complete your order
          </p>
        </div>
        {arrayOfTickets.map((_, index) => (
          <div className="flex justify-between items-center">
            <h3 className="text-base">Ticket {index + 1}</h3>
            <Select onValueChange={(val) => handleDinnerSelection(index, val)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a dinner option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Dinner Options</SelectLabel>
                  <SelectItem value="Steak">Steak</SelectItem>
                  <SelectItem value="Chicken">Chicken</SelectItem>
                  <SelectItem value="Salmon">Salmon</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <TicketIcon className="stroke-1 text-tertiary" />
            <p>
              {ticket.name}{" "}
              <span className="text-muted-foreground text-[0.7rem]">
                x {quantity}
              </span>
            </p>
          </div>
          <p>{`$${subtotal.toFixed(2)}`}</p>
        </div>
      </div>
      <Button
        disabled={dinnerSelections.includes("") || creatingCheckout}
        className="w-full mt-10 p-6"
        onClick={handleCheckout}
      >
        Checkout - ${subtotal.toFixed(2)}
      </Button>
    </div>
  );
}
