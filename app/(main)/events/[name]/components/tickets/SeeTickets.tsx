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
    <div className="w-full rounded-md items-center flex justify-between px-5 font-semibold">
      <p className="text-lg">
        {isTicketFree ? "Tickets FREE" : `Tickets from $${minimumTicketPrice}`}
      </p>
      {eventDisplayData.sales_status == "ATTENDEES_ONLY" ||
      eventDisplayData.sales_status == "SELLING_ALL" ? (
        <>
          {isTicketFree ? (
            <Link href={`/events/${eventDisplayData.cleaned_name}/tickets`}>
              <Button className="border-primary w-32">RSVP</Button>
            </Link>
          ) : (
            <Link href={`/events/${eventDisplayData.cleaned_name}/tickets`}>
              <Button className="border-primary w-32">Buy Now</Button>
            </Link>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
