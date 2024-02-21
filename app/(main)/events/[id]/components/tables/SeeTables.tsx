"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import ApplyNowDialog from "../vendor_applications/ApplyNowDialog";

export default function SeeTables({
  tables,
  event,
  user,
}: {
  tables: Tables<"tables">[];
  event: Tables<"events">;
  user: User | null;
}) {
  const [seeTables, setSeeTables] = useState(false);
  const minimumTablePrice = tables[0].price;

  return (
    <motion.div layout className="bg-background border-[1px] w-full rounded-md">
      {seeTables ? (
        <motion.div
          layout
          className="flex flex-col items-center h-fit p-5 font-bold"
        >
          <motion.h1
            layout="position"
            className="flex justify-between w-full items-center text-lg"
          >
            Event Tables
            <Button
              onClick={() => setSeeTables(false)}
              className="text-base"
              variant={"ghost"}
            >
              <motion.p>Hide</motion.p>
            </Button>
          </motion.h1>
          <motion.div layout className="w-full">
            {tables.map((table, i) => (
              <div
                key={table.id}
                className="font-normal w-full flex justify-between items-center my-6"
              >
                <p>{table.section_name}</p>
                <div className="flex items-center space-x-4">
                  <p>${table.price}</p>
                  {event.vendor_exclusivity === "APPLICATIONS" ? (
                    <ApplyNowDialog
                      event={event}
                      table={table}
                      user={user}
                      tables={tables}
                      prebooked={false}
                    />
                  ) : (
                    table.stripe_price_id &&
                    (event.sales_status === "TABLES_ONLY" ||
                      event.sales_status === "SELLING_ALL") && (
                      <Link
                        href={{
                          pathname: "/checkout",
                          query: {
                            price_id: table.stripe_price_id,
                            user_id: user?.id,
                            event_id: event.id,
                            ticket_id: table.id,
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
                    )
                  )}
                </div>
              </div>
            ))}
            {event.sales_status !== "NO_SALE" && (
              <div className="font-normal w-full flex justify-between items-center my-6">
                <p className="text-sm text-tertiary">
                  Already Booked Your Table?
                </p>
                <ApplyNowDialog
                  event={event}
                  table={tables[0]}
                  user={user}
                  tables={tables}
                  prebooked={true}
                />
              </div>
            )}
            {(() => {
              switch (event.sales_status) {
                case "NO_SALE":
                  return (
                    <div className="text-sm font-normal italic text-tertiary">
                      * Currently not selling tables online
                    </div>
                  );
                case "ATTENDEES_ONLY":
                  return (
                    <div className="text-sm font-normal italic text-tertiary">
                      * Currently only selling general tickets online
                    </div>
                  );
              }
            })()}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="h-20 items-center flex justify-between px-5 font-bold"
        >
          <motion.h1 layout="position" className="text-lg">
            Tables from ${minimumTablePrice}
          </motion.h1>
          <Button
            asChild
            className="text-base border-primary"
            variant={"outline"}
          >
            <motion.button layout="position" onClick={() => setSeeTables(true)}>
              <motion.p layout="position">See Tables</motion.p>
            </motion.button>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
