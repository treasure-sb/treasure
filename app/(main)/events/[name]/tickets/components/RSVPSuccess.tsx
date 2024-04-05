"use client";
import { Button } from "@/components/ui/button";
import { type EventDisplayData } from "@/types/event";
import { TicketIcon } from "lucide-react";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";

export default function RSVPSuccess({
  quantity,
  eventDisplay,
  ticketName,
}: {
  quantity: number;
  eventDisplay: EventDisplayData;
  ticketName: string;
}) {
  return (
    <div className="fixed inset-0 bg-background z-10 text-foreground flex flex-col items-center pt-24 md:pt-40 overflow-y-scroll">
      <h1 className="text-2xl md:text-3xl font-semibold mb-10">
        Thank you for your order
      </h1>
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-10 items-center justify-center">
        <div className="bg-primary w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-lg flex flex-col items-center justify-center text-background">
          <div className="text-center mb-10">
            <TicketIcon className="w-20 h-20 stroke-1 m-auto" />
            <h2 className="font-semibold text-xl md:text-4xl">You're Going</h2>
          </div>
          <div className="text-center">
            <p className="font-semibold text-lg md:text-2xl">
              {eventDisplay.name}
            </p>
            <p className="text-md md:text-lg">
              {moment(eventDisplay.date).format("dddd, MMM Do")}
            </p>
          </div>
        </div>
        <div className="border-[1px] border-foreground/20 rounded-lg w-80 h-80 md:w-[30rem] md:h-[30rem] m-auto flex flex-col justify-between p-2 md:p-6">
          <div className="text-tertiary mx-auto font-semibold">
            {quantity}x {ticketName} Ticket
          </div>
          <div className="w-52 md:w-80 mx-auto">
            <div className="aspect-w-1 aspect-h-1">
              <Image
                className="rounded-xl my-auto"
                alt="event poster image"
                objectFit="cover"
                src={eventDisplay.publicPosterUrl}
                width={1000}
                height={1000}
                priority
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/profile/tickets">
              <Button className="rounded-lg w-32 md:w-40" variant={"tertiary"}>
                View Tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
