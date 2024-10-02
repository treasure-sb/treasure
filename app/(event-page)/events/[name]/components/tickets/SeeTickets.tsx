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
  const numTicketsLeft = tickets.reduce(
    (acc, ticket) => acc + ticket.quantity,
    0
  );

  return (
    <div className="w-full rounded-md items-center flex justify-between font-semibold space-x-4">
      {eventDisplayData.sales_status == "ATTENDEES_ONLY" ||
      eventDisplayData.sales_status == "SELLING_ALL" ? (
        <>
          <div
            className={isTicketFree ? "" : "flex flex-col sm:flex-row sm:gap-1"}
          >
            <p className="text-lg">
              {isTicketFree
                ? "Tickets FREE"
                : eventDisplayData.id === "3733a7f4-365f-4912-bb24-33dcb58f2a19"
                ? "Donations "
                : "Tickets from"}
            </p>
            {!isTicketFree && (
              <p className="text-lg">${minimumTicketPrice.toFixed(2)}</p>
            )}
          </div>
          <Link
            href={`/events/${eventDisplayData.cleaned_name}/tickets${
              eventDisplayData.id === "3733a7f4-365f-4912-bb24-33dcb58f2a19"
                ? "?embed=true"
                : ""
            }`}
            className="relative"
          >
            <Button className="border-primary w-32 rounded-full">
              {isTicketFree
                ? "RSVP"
                : eventDisplayData.id === "3733a7f4-365f-4912-bb24-33dcb58f2a19"
                ? "Donate Now"
                : "Buy Now"}
            </Button>
            {numTicketsLeft < 50 && (
              <p className="text-xs absolute right-0 italic text-tertiary">
                Selling fast!
              </p>
            )}
          </Link>
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
