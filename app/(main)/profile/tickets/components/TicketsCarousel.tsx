"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";
import { type TicketScanningMap } from "../page";
import QrCode from "react-qr-code";

export default function TicketsCarousel({
  eventId,
  tickets,
}: {
  eventId: string;
  tickets: TicketScanningMap;
}) {
  const [currentTicket, setCurrentTicket] = useState(
    tickets.keys().next().value
  );
  const [count, setCount] = useState(tickets.get(currentTicket)!.length);
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentSlide(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleTicketChange = (ticketName: string) => {
    setCurrentTicket(ticketName);
    setCurrentSlide(1);
    setCount(tickets.get(ticketName)!.length);
  };

  return (
    <DialogContent className="h-[60%] md:h-fit">
      <DialogHeader>
        <DialogTitle className="text-center">Tickets</DialogTitle>
        <div className="w-full flex space-x-2">
          {Array.from(tickets).map(([ticketName]) => {
            return (
              <Button
                key={ticketName}
                onClick={() => handleTicketChange(ticketName)}
                variant={"ghost"}
                role="combobox"
                className={cn(
                  "border-dotted border-[1px] rounded-sm flex items-center",
                  ticketName === currentTicket && "bg-secondary"
                )}
              >
                {ticketName}
              </Button>
            );
          })}
        </div>
      </DialogHeader>
      <Carousel
        key={currentTicket}
        setApi={setApi}
        className="w-48 md:w-96 m-auto"
      >
        <CarouselContent>
          {tickets.get(currentTicket)?.map((ticket) => {
            return (
              <CarouselItem key={ticket.ticketId}>
                <div className="relative w-48 h-48 md:w-80 md:h-80 m-auto">
                  <QrCode
                    className="w-full h-full"
                    value={`https://ontreasure.xyz/verify-tickets/?ticket_id=${ticket.ticketId}&event_id=${eventId}`}
                  />
                  {ticket.dates.length === 1 && !ticket.dates[0].valid && (
                    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center w-full">
                      <p className="font-semibold">Ticket Used</p>
                    </div>
                  )}
                </div>

                <div className="flex w-full justify-around mt-2 text-center">
                  {ticket.dates.length > 1 &&
                    ticket.dates.map((date) => (
                      <div className="flex">
                        {date.valid ? (
                          <p className="font-semibold text-xxs sm:text-xs items-end">
                            {new Date(date.date).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "numeric",
                              timeZone: "UTC",
                            })}{" "}
                            : unused
                          </p>
                        ) : (
                          <p className="font-semibold text-xxs sm:text-xs items-end text-red-500">
                            {new Date(date.date).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "numeric",
                              timeZone: "UTC",
                            }) + " "}
                            : used
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {tickets.get(currentTicket)?.length === 1 ? (
          <></>
        ) : (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {currentTicket} Ticket {currentSlide} of {count}
      </div>
    </DialogContent>
  );
}
