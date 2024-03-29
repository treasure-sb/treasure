"use client";

import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { EventDisplayData } from "@/types/event";
import Link from "next/link";

export default function SeeTickets({
  tickets,
  eventDisplayData,
}: {
  tickets: Tables<"tickets">[];
  eventDisplayData: EventDisplayData;
}) {
  const minimumTicketPrice = tickets[0].price;
  const isTicketFree = minimumTicketPrice === 0;

  return (
    <div>
      <div className="bg-background border-[1px] w-full rounded-md h-20 items-center flex justify-between px-5 font-bold">
        <p className="text-lg">
          {isTicketFree
            ? "Tickets are Free!"
            : `Tickets from $${minimumTicketPrice}`}
        </p>
        <Link href={`/events/${eventDisplayData.cleaned_name}/tickets`}>
          <Button className="text-base border-primary" variant={"outline"}>
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
