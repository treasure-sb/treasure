"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SeeTables({
  tables,
  event,
}: {
  tables: Tables<"tables">[];
  event: Tables<"events">;
}) {
  const minimumTablePrice = tables[0].price;

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
        <p className="text-lg">Tables from ${minimumTablePrice.toFixed(2)}</p>
      )}
      {event.sales_status == "TABLES_ONLY" ||
      event.sales_status == "SELLING_ALL" ? (
        <Link href={`/events/${event.cleaned_name}/tables`}>
          <Button className="border-primary w-32">Register Now</Button>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}
