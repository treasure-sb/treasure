import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ExportButton from "./ExportButton";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  const { data: ticketsData, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", eventData.id);

  const { data: soldTicketsData, error: soldTicketsError } = await supabase
    .from("event_tickets")
    .select("*, ticket_info:tickets(*), user_info:profiles(*)")
    .eq("event_id", eventData.id)
    .order("created_at", { ascending: false });

  const ticketsArr: any[] = soldTicketsData ? soldTicketsData : [];

  return (
    <div className="flex flex-col gap-4 overflow-visible ">
      <h1 className="font-semibold text-4xl text-tertiary">Sales</h1>
      <h1 className="text-2xl font-semibold mt-4">Ticket Types</h1>
      <div className="flex flex-col gap-2 min-w-fit sm:w-full text-sm sm:text-lg border border-secondary rounded-sm">
        <div className="w-full flex p-4">
          <div className="w-2/5">Name</div>
          <div className="w-1/5 text-center">Status</div>
          <div className="w-1/5 text-center">Price</div>
          <div className="w-1/5 text-right">Sold</div>
        </div>
        {ticketsData?.map((ticket: any) => (
          <div className="w-full flex p-4 border-t">
            <div className="w-2/5">{ticket.name}</div>

            {eventData.sales_status === "SELLING_ALL" ||
            eventData.sales_status === "ATTENDEES_ONLY" ? (
              <div className="w-1/5 text-center text-tertiary">On Sale</div>
            ) : (
              <div className="w-1/5 text-center text-red-600">Not Selling</div>
            )}

            <div className="w-1/5 text-center">${ticket.price}</div>
            <div className="w-1/5 text-right">
              {soldTicketsData?.length + "/" + ticket.quantity}
            </div>
          </div>
        ))}
      </div>
      <ExportButton soldTicketsData={ticketsArr} eventName={name} />
      <div className="sm:flex flex-col hidden w-full text-lg border border-secondary rounded-sm">
        <div className="flex p-4">
          <div className="w-2/6">Name</div>
          <div className="w-1/6 text-center">Tickets</div>
          <div className="w-1/6 text-center">Total Spend</div>
          <div className="w-1/6 text-center">Contact</div>
          <div className="w-1/6 text-right">Purchase Date</div>
        </div>
        {soldTicketsData?.map((ticket: any) => (
          <div className="w-full flex p-4 border-t">
            <div className="w-2/6 flex flex-col">
              <div>
                {ticket.user_info.first_name + " " + ticket.user_info.last_name}
              </div>
              <div className="text-xs">@{ticket.user_info.username}</div>
            </div>
            <div className="w-1/6 text-center">{ticket.ticket_info.name}</div>
            <div className="w-1/6 text-center">${ticket.ticket_info.price}</div>
            <div className="w-1/6 flex flex-col text-center">
              <div className="text-sm">{ticket.user_info.phone}</div>
              <div className="text-sm">{ticket.user_info.email}</div>
            </div>
            <div className="w-1/6 text-right flex flex-col">
              <div>
                {new Date(ticket.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="text-xs">
                {
                  new Date(ticket.created_at)
                    .toLocaleDateString(undefined, {
                      hour: "numeric",
                      minute: "numeric",
                    })
                    .split(",")[1]
                }
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ------------------------------- Mobile Transactions  ------------------------------- */}

      <Accordion
        type="single"
        collapsible
        className="flex flex-col border border-secondary sm:hidden gap-4 w-full mb-4 rounded-sm"
      >
        {soldTicketsData?.map((ticket: any, i: number) => (
          <AccordionItem key={i} value={i.toString()} className="w-full px-2">
            <AccordionTrigger className="flex text-lg text-left w-full hover:no-underline">
              <div className="flex flex-col">
                <div>{ticket.user_info.first_name}</div>
                <div className="text-xs">{ticket.user_info.last_name}</div>
              </div>
              <div className="flex flex-col text-center">
                <div>${ticket.ticket_info.price}</div>
                <div className="text-xs">{ticket.ticket_info.name}</div>
              </div>
              <div className="text-right flex flex-col">
                <div>
                  {new Date(ticket.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs">
                  {
                    new Date(ticket.created_at)
                      .toLocaleDateString(undefined, {
                        hour: "numeric",
                        minute: "numeric",
                      })
                      .split(",")[1]
                  }
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col text-lg text-left w-full hover:no-underline gap-2">
              <div className="text-base font-semibold">Contact Info</div>
              <div className="text-sm">{ticket.user_info.phone}</div>
              <div className="text-sm">{ticket.user_info.email}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
