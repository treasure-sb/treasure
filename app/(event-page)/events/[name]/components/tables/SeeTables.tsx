"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventWithDates } from "@/types/event";

export default function SeeTables({
  tables,
  event,
}: {
  tables: Tables<"tables">[];
  event: EventWithDates;
}) {
  const minimumTablePrice = tables[0].price;
  const numTablesLeft = tables.reduce((acc, table) => acc + table.quantity, 0);
  const sayWaitlist = event.id === "e397bbe5-f006-489e-b89d-06130fad72df";

  return (
    <div className="w-full items-center flex justify-between font-semibold space-x-4">
      {event.vendor_exclusivity === "APPLICATIONS_NO_PAYMENT" ? (
        <div>
          <p className="text-lg">Tables Available</p>
          <p className="text-muted-foreground font-semibold text-xs">
            (Priced Upon Approval)
          </p>
        </div>
      ) : (
        <>
          {event.sales_status == "TABLES_ONLY" ||
          event.sales_status == "SELLING_ALL" ? (
            <>
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <p className="text-lg">Tables from</p>
                <p className="text-lg">${minimumTablePrice.toFixed(2)}</p>
              </div>
              <Link
                href={`/events/${event.cleaned_name}/tables`}
                className="relative"
              >
                <Button className="border-primary w-32">
                  {sayWaitlist ? "Waitlist Now" : "Register Now"}
                </Button>
                {numTablesLeft < 20 && (
                  <p className="absolute text-xs right-0 -bottom-4 italic text-primary/90">
                    {numTablesLeft} tables left!
                  </p>
                )}
              </Link>
            </>
          ) : (
            <div className="flex gap-1">
              <p className="text-lg">Tables from</p>
              <p className="text-lg">${minimumTablePrice.toFixed(2)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
