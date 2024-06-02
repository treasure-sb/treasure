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
    <div className="w-full rounded-md items-center flex justify-between font-semibold space-x-4">
      {eventDisplayData.sales_status == "ATTENDEES_ONLY" ||
      eventDisplayData.sales_status == "SELLING_ALL" ? (
        <>
          {isTicketFree ? (
            <>
              <p className="text-lg">Tickets FREE</p>
              <Link href={`/events/${eventDisplayData.cleaned_name}/tickets`}>
                <Button className="border-primary w-32">RSVP</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:gap-1">
                <p className="text-lg">Tickets from</p>
                <p className="text-lg">${minimumTicketPrice.toFixed(2)}</p>
              </div>
              <Link href={`/events/${eventDisplayData.cleaned_name}/tickets`}>
                <Button className="border-primary w-32">Buy Now</Button>
              </Link>
            </>
          )}
        </>
      ) : (
        <p className="text-lg">
          {isTicketFree
            ? "Tickets FREE"
            : `Tickets from $${minimumTicketPrice.toFixed(2)}`}
        </p>
      )}
    </div>
  );
}
