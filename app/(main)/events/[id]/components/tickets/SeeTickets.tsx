"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function SeeTickets({
  tickets,
  event,
  user,
}: {
  tickets: Tables<"tickets">[];
  event: Tables<"events">;
  user: User | null;
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
          <motion.h1
            layout="position"
            className="flex justify-between w-full text-lg items-center"
          >
            Event Tickets
            <Button
              onClick={() => setSeeTickets(false)}
              className="text-base"
              variant={"ghost"}
            >
              <motion.p>Hide</motion.p>
            </Button>
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
                  {ticket.stripe_price_id &&
                    event.sales_status === "SELLING_ALL" && (
                      <Link
                        href={{
                          pathname: "/checkout",
                          query: {
                            price_id: ticket.stripe_price_id,
                            user_id: user?.id,
                            event_id: event.id,
                            ticket_id: ticket.id,
                            quantity: 1,
                          },
                        }}
                      >
                        <Button
                          variant={"outline"}
                          className="font-normal text-sm p-2 border-primary"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    )}
                </div>
              </div>
            ))}
          </motion.div>
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
            asChild
            className="text-base border-primary h-"
            variant={"outline"}
          >
            <motion.button
              layout="position"
              onClick={() => setSeeTickets(true)}
            >
              <motion.p layout="position">See Tickets</motion.p>
            </motion.button>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
