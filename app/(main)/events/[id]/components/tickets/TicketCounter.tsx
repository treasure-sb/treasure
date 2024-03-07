import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { useRouter } from "next/navigation";
import { EventDisplayData } from "@/types/event";
import { toast } from "sonner";
import LoginFlowDialog from "@/components/ui/custom/login-flow-dialog";

export default function TicketCounter({
  ticket,
  user,
  eventDisplayData,
}: {
  ticket: Tables<"tickets">;
  user: User | null;
  eventDisplayData: EventDisplayData;
}) {
  const { push } = useRouter();
  const [ticketCount, setTicketCount] = useState(1);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const minTickets = 1;
  const maxTickets = 6;

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
    if (!user) {
      return;
    }
    setCreatingCheckout(true);
    const { data, error } = await createCheckoutSession({
      event_id: eventDisplayData.id,
      ticket_id: ticket.id,
      ticket_type: "TICKET",
      user_id: user.id,
      quantity: ticketCount,
    });

    if (data && !error) {
      const checkoutSession: Tables<"checkout_sessions"> = data[0];
      push(`/checkout/${checkoutSession.id}`);
    } else {
      toast.error("Error creating checkout session");
      setCreatingCheckout(false);
    }
  };

  const checkoutButton = (
    <Button
      disabled={creatingCheckout}
      onClick={async () => await handleCheckout()}
      className="w-full rounded-md"
    >
      Checkout - ${ticket.price * ticketCount}
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex space-x-6 justify-center">
        <Button
          disabled={ticketCount === minTickets}
          className="text-4xl disabled:text-foreground/40"
          variant={"ghost"}
          onClick={handleDecrement}
        >
          -
        </Button>
        <p className="text-3xl">{ticketCount}</p>
        <Button
          disabled={ticketCount === maxTickets}
          className="text-4xl rounded-md disabled:text-foreground/40"
          variant={"ghost"}
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
      {user ? checkoutButton : <LoginFlowDialog trigger={checkoutButton} />}
    </div>
  );
}
