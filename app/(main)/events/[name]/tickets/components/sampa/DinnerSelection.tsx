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
import { Tables } from "@/types/supabase";
import { TicketIcon } from "lucide-react";
import { useState } from "react";

const dinnerOptions = {
  rest: [
    { value: "steak", label: "Steak" },
    { value: "chicken", label: "Chicken" },
    { value: "salmon", label: "Salmon" },
  ],
  benefactor: [
    { value: "2-steak", label: "2 Steak Dinners" },
    { value: "2-chicken", label: "2 Chicken Dinners" },
    { value: "2-salmon", label: "2 Salmon Dinners" },
    { value: "1-steak-1-chicken", label: "1 Steak, 1 Chicken" },
    { value: "1-steak-1-salmon", label: "1 Steak, 1 Salmon" },
    { value: "1-chicken-1-salmon", label: "1 Chicken, 1 Salmon" },
  ],
};

export default function DinnerSelection({
  goBackToTickets,
  ticket,
  quantity,
}: {
  goBackToTickets: () => void;
  ticket: Tables<"tickets">;
  quantity: number;
}) {
  const [dinnerSelections, setDinnerSelections] = useState<string[]>(
    Array(quantity).fill("")
  );
  const subtotal = ticket.price * quantity;
  const arrayOfTickets = Array.from({ length: quantity });

  const handleDinnerSelection = (index: number, value: string) => {
    setDinnerSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] =
        dinnerOptionsList.find((option) => option.value === value)?.label || "";
      return newSelections;
    });
  };

  const dinnerOptionsList =
    ticket.id === "45c89043-d102-4335-9a91-5a1c00636ef2"
      ? dinnerOptions.benefactor
      : dinnerOptions.rest;

  const selectOptions = dinnerOptionsList.map((option) => (
    <SelectItem value={option.value}>{option.label}</SelectItem>
  ));

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
                  {selectOptions}
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
        disabled={dinnerSelections.includes("")}
        className="w-full mt-10 p-6"
        onClick={() => console.log(dinnerSelections)}
      >
        Checkout - ${subtotal.toFixed(2)}
      </Button>
    </div>
  );
}
