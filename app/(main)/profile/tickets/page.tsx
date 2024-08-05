import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { getEventDisplayData } from "@/lib/helpers/events";
import { TicketIcon, Users2Icon } from "lucide-react";
import { EventDisplayData, EventWithDates } from "@/types/event";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tables } from "@/types/supabase";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import TicketsCarousel from "./components/TicketsCarousel";
import { getProfile } from "@/lib/helpers/profiles";

interface TicketScanningInfo {
  ticketId: string;
  valid: boolean;
}

export type TicketScanningMap = Map<string, TicketScanningInfo[]>;
type EventTicketMap = Map<string, TicketScanningMap>;
type EventDisplayMap = Map<string, EventDisplayData>;
type EventTicket = Tables<"event_tickets"> & {
  event: EventWithDates;
  ticket: {
    name: string;
  };
};

type EventTable = Tables<"event_vendors"> & {
  event: EventWithDates;
  table: Tables<"tables">;
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const { data: ticketData } = await supabase
    .from("event_tickets")
    .select("*, event:events(*), ticket:tickets(name)")
    .eq("attendee_id", user.id);

  const eventTickets: EventTicket[] = ticketData || [];
  const eventTicketMap: EventTicketMap = new Map();
  const eventDisplayMap: EventDisplayMap = new Map();

  eventTickets.forEach(async (ticket) => {
    const ticketId = ticket.id;
    const valid = ticket.valid;
    const eventId = ticket.event.id;
    const ticketName = ticket.ticket.name;

    if (!eventTicketMap.has(eventId)) {
      eventTicketMap.set(eventId, new Map());
    }

    const ticketsMap = eventTicketMap.get(eventId)!;
    if (ticketsMap.has(ticketName)) {
      ticketsMap.get(ticketName)!.push({ ticketId, valid });
    } else {
      ticketsMap.set(ticketName, [{ ticketId, valid }]);
    }
  });

  const displayPromise = ticketData?.map(async (ticket) => {
    const eventId = ticket.event.id;
    const event = ticket.event;
    if (!eventDisplayMap.has(eventId)) {
      const displayData = await getEventDisplayData(event);
      eventDisplayMap.set(eventId, displayData);
    }
  });

  await Promise.all(displayPromise || []);

  const { data: tableData } = await supabase
    .from("event_vendors")
    .select("*, event:events(*), table:tables(*)")
    .eq("vendor_id", user.id)
    .eq("payment_status", "PAID");

  const eventTables: EventTable[] = tableData || [];

  const tableTicketsPromise = eventTables.map(async (table) => {
    const event = table.event;
    const eventTable = table.table;
    const displayData = await getEventDisplayData(event);
    const tableTicket = {
      displayData,
      tableName: eventTable.section_name,
      numberOfVendors: table.vendors_at_table,
      tableQuantity: table.table_quantity,
      inventory: table.inventory,
    };
    return tableTicket;
  });

  const tableTickets = await Promise.all(tableTicketsPromise || []);
  const { profile } = await getProfile(user.id);

  return (
    <main className="w-full max-w-6xl m-auto">
      <h2 className="text-center font-semibold text-2xl mb-6">My Tickets</h2>
      {!ticketData?.length && !tableData?.length && (
        <p className="text-center">You don't have any tickets yet.</p>
      )}

      <div className="space-y-8">
        {ticketData && ticketData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tickets</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
              {Array.from(eventTicketMap).map(([eventId, eventTicketsMap]) => {
                const displayData = eventDisplayMap.get(
                  eventId
                ) as EventDisplayData;
                const ticketsArray = Array.from(eventTicketsMap);
                return (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={eventId}
                        className="hover:translate-y-[-.5rem] hover:cursor-pointer transition duration-500 relative"
                      >
                        <EventDisplay
                          clickable={false}
                          user={user}
                          showLikeButton={false}
                          event={displayData}
                        />
                        <div className="flex space-x-4">
                          {ticketsArray.map(([ticketName, tickets]) => {
                            return (
                              <div
                                key={ticketName}
                                className="flex items-center space-x-2"
                              >
                                <TicketIcon
                                  className="stroke-1 text-tertiary"
                                  size={24}
                                />
                                <p>{ticketName}</p>
                                <p>x{tickets.length}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </DialogTrigger>
                    <TicketsCarousel
                      eventId={eventId}
                      tickets={eventTicketsMap}
                    />
                  </Dialog>
                );
              })}
            </div>
          </div>
        )}

        {tableData && tableData.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tables</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
              {tableTickets.map(
                ({
                  displayData,
                  tableName,
                  tableQuantity,
                  numberOfVendors,
                  inventory,
                }) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={displayData.id}
                        className="hover:translate-y-[-.5rem] hover:cursor-pointer transition duration-500 relative"
                      >
                        <EventDisplay
                          clickable={false}
                          user={user}
                          showLikeButton={false}
                          event={displayData}
                        />
                        <div
                          key={tableName}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex space-x-2">
                            <TicketIcon
                              className="stroke-1 text-primary"
                              size={24}
                            />
                            <p>{tableName}</p>
                            <p>x{tableQuantity}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Users2Icon
                              size={24}
                              className="text-primary stroke-1"
                            />
                            <p>x{numberOfVendors}</p>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Table Confirmation</DialogTitle>
                        <DialogDescription>
                          Show this confirmation to the event organizer to claim
                          your table.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <p className="font-semibold">Name: </p>
                          <p>
                            {profile.first_name} {profile.last_name}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <p className="font-semibold">Business Name: </p>
                          <p>{profile.business_name || "N/A"}</p>
                        </div>
                        <div className="flex space-x-2">
                          <p className="font-semibold">Table Section: </p>
                          <p>{tableName}</p>
                        </div>
                        <div className="flex space-x-2">
                          <p className="font-semibold">Table Quantity: </p>
                          <p>{tableQuantity}</p>
                        </div>
                        <div className="flex space-x-2">
                          <p className="font-semibold">Vendors at Table: </p>
                          <p>{numberOfVendors}</p>
                        </div>
                        <div className="flex space-x-2">
                          <p className="font-semibold">Inventory: </p>
                          <p>{inventory}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
