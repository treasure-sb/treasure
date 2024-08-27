"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useRouter } from "next/navigation";
import { EventDisplayData } from "@/types/event";
import { toast } from "sonner";

export default function TicketCounter({
  ticket,
  user,
  event,
}: {
  ticket: Tables<"tickets">;
  user: User | null;
  event: EventDisplayData;
}) {
  const { push } = useRouter();
  const [ticketCount, setTicketCount] = useState(1);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const isTicketFree = ticketCount * ticket.price === 0;
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

  const handleCheckout = async () => {
    setCreatingCheckout(true);
    const { data, error } = await createCheckoutSession({
      event_id: event.id,
      ticket_id: ticket.id,
      ticket_type: "TICKET",
      user_id: user?.id || null,
      quantity: ticketCount,
    });

    if (data && !error) {
      const checkoutSession: Tables<"checkout_sessions"> = data;
      push(`/checkout/${checkoutSession.id}`);
    } else {
      toast.error("Error creating checkout session");
      setCreatingCheckout(false);
    }
  };

  const handleRSVP = async () => {
    setCreatingCheckout(true);

    const { data, error } = await createCheckoutSession({
      event_id: event.id,
      ticket_id: ticket.id,
      ticket_type: "TICKET",
      user_id: user?.id || null,
      quantity: ticketCount,
      price_type: "RSVP",
    });

    if (data && !error) {
      const checkoutSession: Tables<"checkout_sessions"> = data;
      push(`/checkout/${checkoutSession.id}`);
    } else {
      toast.error("Error creating checkout session");
      setCreatingCheckout(false);
    }
  };

  const checkoutButton = (
    <Button
      disabled={creatingCheckout || isTicketFree || isSoldOut}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-full p-6 relative"
    >
      Checkout - ${(ticket.price * ticketCount).toFixed(2)}
      {isSoldOut && (
        <div className="absolute -rotate-12 bg-red-500 p-2 w-36">Sold Out</div>
      )}
    </Button>
  );

  const RSVPButton = (
    <Button
      disabled={creatingCheckout}
      onClick={async () => await handleRSVP()}
      className="w-full rounded-full p-6"
    >
      RSVP - Free
    </Button>
  );

  return (
    <div className="space-y-4 dark:text-background">
      <div className="flex space-x-6 justify-center">
        <Button
          disabled={ticketCount === minTickets}
          className="text-4xl disabled:text-foreground/40 dark:disabled:text-background/40 dark:hover:bg-background/10 dark:hover:text-background"
          variant={"ghost"}
          onClick={handleDecrement}
        >
          -
        </Button>
        <p className="text-3xl">{ticketCount}</p>
        <Button
          disabled={ticketCount === maxTickets}
          className="text-4xl disabled:text-foreground/40 dark:disabled:text-background/40 dark:hover:bg-background/10 dark:hover:text-background"
          variant={"ghost"}
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      {isTicketFree ? RSVPButton : checkoutButton}
    </div>
  );
}
