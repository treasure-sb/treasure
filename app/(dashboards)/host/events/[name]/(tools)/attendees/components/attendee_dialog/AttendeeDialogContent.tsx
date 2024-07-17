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

type TicketFetchData = {
  id: string;
  valid: boolean;
  tickets: { name: string };
};

type FormattedTicket = {
  ticketId: string;
  valid: boolean;
};

export default function AttendeeDialogContent({
  attendeeData,
  event,
}: {
  attendeeData: Attendee;
  event: Tables<"events">;
}) {
  const supabase = createClient();
  const { avatar_url, first_name, last_name, email, phone } =
    attendeeData.customer;

  const { data, isLoading } = useQuery({
    queryKey: [attendeeData.customer.email + "tickets"],
    queryFn: async () => {
      const { data } = await supabase
        .from("event_tickets")
        .select("id, valid, tickets(name)")
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
        { ticketId: tickets.id, valid: tickets.valid },
      ]);
    } else {
      acc.set(tickets.tickets.name, [
        { ticketId: tickets.id, valid: tickets.valid },
      ]);
    }
    return acc;
  }, new Map<string, FormattedTicket[]>());

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
            <div className="space-y-2 bg-secondary/30 rounded-sm p-4 h-fit max-h-32 overflow-y-auto">
              <h4 className="font-semibold">{ticketType}</h4>
              <div className="space-y-4">
                {tickets.map((ticket: FormattedTicket) => {
                  overallTicketCount++;
                  return (
                    <div
                      key={ticket.ticketId}
                      className="flex space-x-4 justify-between"
                    >
                      <p>Ticket {overallTicketCount}</p>
                      <p>
                        {ticket.valid ? <NotScannedIcon /> : <ScannedIcon />}
                      </p>
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
