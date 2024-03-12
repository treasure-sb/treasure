"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { EventDisplayData } from "@/types/event";
import { AnimatePresence } from "framer-motion";
import TicketsOverlay from "./TicketsOverlay";

export default function SeeTickets({
  tickets,
  user,
  eventDisplayData,
}: {
  tickets: Tables<"tickets">[];
  user: User | null;
  eventDisplayData: EventDisplayData;
}) {
  const [seeTicketsOverlay, setSeeTicketsOverlay] = useState(false);
  const minimumTicketPrice = tickets[0].price;
  const isTicketFree = minimumTicketPrice === 0;

  return (
    <div>
      <AnimatePresence>
        {seeTicketsOverlay && (
          <TicketsOverlay
            goBack={() => setSeeTicketsOverlay(false)}
            eventDisplayData={eventDisplayData}
            tickets={tickets}
            user={user}
          />
        )}
      </AnimatePresence>
      <div className="bg-background border-[1px] w-full rounded-md">
        <div className="h-20 items-center flex justify-between px-5 font-bold">
          <p className="text-lg">
            {isTicketFree
              ? "Tickets are Free!"
              : `Tickets from $${minimumTicketPrice}`}
          </p>
          <Button
            onClick={() => setSeeTicketsOverlay(true)}
            className="text-base border-primary"
            variant={"outline"}
          >
            See Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
