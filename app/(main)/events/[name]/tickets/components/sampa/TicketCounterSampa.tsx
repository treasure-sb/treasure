"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";

export default function TicketCounterSampa({
  ticket,
  user,
  goToDinner,
  onTicketSelection,
  updateQuantity,
}: {
  ticket: Tables<"tickets">;
  user: User | null;
  goToDinner: () => void;
  onTicketSelection: (ticket: Tables<"tickets">) => void;
  updateQuantity: (quantity: number) => void;
}) {
  const [ticketCount, setTicketCount] = useState(1);
  const isSoldOut = ticket.quantity === 0;
  const minTickets = 1;
  const maxTickets = Math.min(ticket.quantity, 6);

  const handleIncrement = () => {
    if (ticketCount < maxTickets) {
      setTicketCount(ticketCount + 1);
    }
  };

  const handleDecrement = () => {
    if (ticketCount > minTickets) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleContinue = () => {
    updateQuantity(ticketCount);
    onTicketSelection(ticket);
    goToDinner();
  };

  const ContinueButton = (
    <Button
      disabled={isSoldOut}
      onClick={user ? handleContinue : () => {}}
      className="w-full rounded-full p-6 relative"
    >
      Continue - ${(ticket.price * ticketCount).toFixed(2)}
      {isSoldOut && (
        <div className="absolute -rotate-12 bg-red-500 p-2 w-36">Sold Out</div>
      )}
    </Button>
  );

  return (
    <div className="space-y-4 text-background">
      <div className="flex space-x-6 justify-center">
        <Button
          disabled={ticketCount === minTickets}
          className="text-4xl disabled:text-background/40 hover:bg-background/10 hover:text-background"
          variant={"ghost"}
          onClick={handleDecrement}
        >
          -
        </Button>
        <p className="text-3xl">{ticketCount}</p>
        <Button
          disabled={ticketCount === maxTickets}
          className="text-4xl disabled:text-background/40 hover:bg-background/10 hover:text-background"
          variant={"ghost"}
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      {user ? ContinueButton : <LoginFlowDialog trigger={ContinueButton} />}
    </div>
  );
}
