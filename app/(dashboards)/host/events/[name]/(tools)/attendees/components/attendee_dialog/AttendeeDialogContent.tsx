import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Attendee } from "../table/AttendeeDataColumns";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import { Key } from "react";
import React from "react";
import { EventWithDates } from "@/types/event";
import { formatDate } from "@/lib/utils";

type TicketFetchData = {
  id: string;
  tickets: { name: string };
  event_tickets_dates: { valid: boolean; event_dates: { date: string } }[];
};

type FormattedTicket = {
  ticketId: string;
  event_tickets_dates: { valid: boolean; date: string }[];
};

export default function AttendeeDialogContent({
  attendeeData,
  event,
}: {
  attendeeData: Attendee;
  event: EventWithDates;
}) {
  const supabase = createClient();
  const { avatar_url, first_name, last_name, email, phone } =
    attendeeData.customer;

  const { data, isLoading } = useQuery({
    queryKey: [attendeeData.id + "tickets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_tickets")
        .select(
          "id, tickets(name), event_tickets_dates(valid, event_dates(date))"
        )
        .eq("attendee_id", attendeeData.id)
        .eq("event_id", event.id)
        .returns<TicketFetchData[]>();
      if (!data) return [];
      return data;
    },
    enabled: true,
  });

  const ticketData: TicketFetchData[] = data || [];
  const formattedTicketData = ticketData.reduce((acc, tickets) => {
    if (acc.has(tickets.tickets.name)) {
      acc.set(tickets.tickets.name, [
        ...acc.get(tickets.tickets.name)!,
        {
          ticketId: tickets.id,
          event_tickets_dates: tickets.event_tickets_dates.map((etd) => {
            return { valid: etd.valid, date: etd.event_dates.date };
          }),
        },
      ]);
    } else {
      acc.set(tickets.tickets.name, [
        {
          ticketId: tickets.id,
          event_tickets_dates: tickets.event_tickets_dates.map((etd) => {
            return { valid: etd.valid, date: etd.event_dates.date };
          }),
        },
      ]);
    }
    return acc;
  }, new Map<string, FormattedTicket[]>());

  console.log(formattedTicketData);

  let overallTicketCount = 0;

  const ScannedIcon = () => {
    return (
      <span className="bg-primary/10 text-green-500 rounded-[3px] p-1">
        Scanned
      </span>
    );
  };

  const NotScannedIcon = () => {
    return (
      <span className="bg-red-600/10 text-red-500 rounded-[3px] p-1">
        Not Scanned
      </span>
    );
  };

  return (
    <DialogContent className="h-fit max-h-[80%] w-[80%] md:w-[36rem]">
      <DialogHeader>
        <DialogTitle>
          {first_name} {last_name}
        </DialogTitle>
        <DialogDescription>
          {email} {phone ? `· ${phone}` : ""}
        </DialogDescription>
      </DialogHeader>
      <Avatar className="w-24 h-24 md:w-28 md:h-28 mx-auto md:mx-0">
        <AvatarImage src={avatar_url} />
        <AvatarFallback />
      </Avatar>
      <div className="space-y-4">
        {Array.from(formattedTicketData).map(([ticketType, tickets], index) => (
          <div key={ticketType}>
            <div className="space-y-2 bg-secondary/30 rounded-sm p-4 h-fit max-h-32 sm:max-h-44 overflow-y-auto">
              <h4 className="font-semibold">{ticketType}</h4>
              <div className="space-y-4">
                {tickets.map((ticket: FormattedTicket) => {
                  overallTicketCount++;
                  return (
                    <div
                      key={ticket.ticketId}
                      className="flex flex-col space-x-4 justify-between"
                    >
                      <p>Ticket {overallTicketCount}</p>
                      <div className="flex flex-col gap-3 ">
                        {ticket.event_tickets_dates.map((etd) => {
                          return (
                            <div className="flex w-full justify-between items-center">
                              <p className="text-muted-foreground text-xs">
                                {formatDate(etd.date)}
                              </p>
                              <p>
                                {etd.valid ? (
                                  <NotScannedIcon />
                                ) : (
                                  <ScannedIcon />
                                )}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  );
}
