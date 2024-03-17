"use client";

import { Tables } from "@/types/supabase";

export default function TicketsInfo({
  tickets,
}: {
  tickets: Tables<"tickets">[];
}) {
  return (
    <div className="flex flex-col gap-10">
      {tickets.length > 0 ? (
        tickets?.map((ticket) => (
          <div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">name :</p>
              <p className="font-semibold text-primary"> {ticket.name}</p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">price :</p>
              <p className="font-semibold text-primary">${ticket.price}</p>
            </div>
            <div className="flex w-full justify-between md:justify-start items-center gap-4">
              <p className="md:w-52">quantity :</p>
              <p className="font-semibold text-primary">{ticket.quantity}</p>
            </div>
          </div>
        ))
      ) : (
        <>No Tickets</>
      )}
    </div>
  );
}
