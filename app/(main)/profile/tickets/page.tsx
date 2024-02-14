import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { getEventDisplayData } from "@/lib/helpers/events";
import { TicketIcon } from "lucide-react";
import { EventDisplayData } from "@/types/event";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EventDisplay from "@/components/events/shared/EventDisplay";
import createSupabaseServerClient from "@/utils/supabase/server";
import TicketsCarousel from "./components/TicketsCarousel";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  const { data: ticketData } = await supabase
    .from("event_tickets")
    .select("*, event:events(*), ticket:tickets(*)")
    .eq("attendee_id", user.id);

  const eventTicketMap = new Map<string, Map<string, string[]>>();
  const eventDisplayMap = new Map<string, EventDisplayData>();

  ticketData?.forEach(async (ticket) => {
    const eventId = ticket.event.id;
    const ticketName = ticket.ticket.name;
    const ticketId = ticket.id;

    if (!eventTicketMap.has(eventId)) {
      eventTicketMap.set(eventId, new Map());
    }

    const ticketsMap = eventTicketMap.get(eventId)!;
    if (ticketsMap.has(ticketName)) {
      ticketsMap.get(ticketName)!.push(ticketId);
    } else {
      ticketsMap.set(ticketName, [ticketId]);
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

  return (
    <main className="w-full max-w-6xl m-auto">
      <h1 className="text-center font-semibold text-2xl mb-6">My Tickets</h1>
      {!ticketData?.length ? (
        <p className="text-center">You don't have any tickets yet.</p>
      ) : (
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
                    <div className="absolute inset-0" />
                  </div>
                </DialogTrigger>
                <TicketsCarousel eventId={eventId} tickets={eventTicketsMap} />
              </Dialog>
            );
          })}
        </div>
      )}
    </main>
  );
}
