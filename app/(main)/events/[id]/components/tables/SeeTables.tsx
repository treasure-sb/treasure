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
          <motion.h1 layout="position" className="text-lg">
            Event Tables
          </motion.h1>
          <motion.div layout className="w-full">
            {tables.map((table) => (
              <div
                key={table.id}
                className="font-normal w-full flex justify-between items-center my-6"
              >
                <p>{table.section_name}</p>
                <div className="flex items-center space-x-4">
                  <p>${table.price}</p>
                  {event.vendor_exclusivity === "APPLICATIONS" ? (
                    <ApplyNowDialog event={event} table={table} user={user} />
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
                          className="font-normal text-sm p-2"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </motion.div>
          <Button
            onClick={() => setSeeTables(false)}
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
            Tables from ${minimumTablePrice}
          </motion.h1>
          <Button
            onClick={() => setSeeTables(true)}
            className="text-base"
            variant={"ghost"}
          >
            <motion.p layout="position">See Tables</motion.p>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
