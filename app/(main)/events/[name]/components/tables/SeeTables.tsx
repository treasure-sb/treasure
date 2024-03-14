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
    <div className="bg-background border-[1px] w-full rounded-md h-20 items-center flex justify-between px-5 font-bold">
      <p className="text-lg">Tickets from ${minimumTablePrice}</p>
      <Link href={`/events/${event.cleaned_name}/tables`}>
        <Button className="text-base border-primary" variant={"outline"}>
          See Tickets
        </Button>
      </Link>
    </div>
  );
}
