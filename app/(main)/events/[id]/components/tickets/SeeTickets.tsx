"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function SeeTickets({
  tickets,
  event,
  checkoutUrl,
}: {
  tickets: Tables<"tickets">[];
  event: Tables<"events">;
  checkoutUrl: string;
}) {
  const [seeTickets, setSeeTickets] = useState(false);
  const minimumTicketPrice = tickets[0].price;

  return (
    <motion.div layout className="bg-background border-[1px] w-full rounded-md">
      {seeTickets ? (
        <motion.div
          layout
          className="flex flex-col items-center h-fit p-5 font-bold"
        >
          <motion.h1 layout="position" className="text-lg">
            Event Tickets
          </motion.h1>
          <motion.div layout className="w-full">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="font-normal w-full flex justify-between items-center my-6"
              >
                <p>{ticket.name}</p>
                <div className="flex items-center space-x-4">
                  <p>${ticket.price}</p>
                  {event.sales_status === "SELLING_ALL" && (
                    <Link target="_blank" href={checkoutUrl}>
                      <Button
                        variant={"outline"}
                        className="font-normal text-sm p-2"
                      >
                        Buy Now
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
          <Button
            onClick={() => setSeeTickets(false)}
            className="text-base mt-2"
            variant={"ghost"}
          >
            <motion.p>Back</motion.p>
          </Button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="h-20 items-center flex justify-between px-5 font-bold"
        >
          <motion.h1 layout="position" className="text-lg">
            {minimumTicketPrice === 0
              ? "Tickets are Free!"
              : `Tickets from $${minimumTicketPrice}`}
          </motion.h1>
          <Button
            onClick={() => setSeeTickets(true)}
            className="text-base"
            variant={"ghost"}
          >
            <motion.p layout="position">See Tickets</motion.p>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
