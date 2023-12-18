import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTicketTailorCheckoutUrl } from "@/lib/actions/ticket-tailor";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export default async function Tickets({ event }: { event: Tables<"events"> }) {
  const supabase = await createSupabaseServerClient();
  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .neq("name", "Table");

  const cheapestTicket = tickets?.reduce((prev: any, cur: any) => {
    return prev.price < cur.price ? prev : cur;
  }, 0);

  const checkoutURL = await getTicketTailorCheckoutUrl(
    event.ticket_tailor_event_id === null ? "" : event.ticket_tailor_event_id
  );

  return (
    <>
      {tickets && tickets.length > 0 ? (
        <div className="bg-secondary w-full h-20 items-center rounded-md flex justify-between px-5 font-bold">
          <h1 className="text-lg">Tickets from ${cheapestTicket.price}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary h-[70%] w-24 rounded-md text-background text-md font-bold">
                Buy Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl p-4 mb-6 text-center border-b-2">
                  Tickets
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                {tickets?.map((ticket: any) => (
                  <div
                    key={ticket.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h1 className="font-semibold text-xl">
                        {ticket.name} ${ticket.price}
                      </h1>
                    </div>
                    <Link target="_blank" href={checkoutURL}>
                      <Button>Buy Now!</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <h1>No Tickets</h1>
      )}
    </>
  );
}
