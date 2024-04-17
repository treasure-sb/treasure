import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", event)
    .single();

  const { data: ticketsData, error: ticketsError } = await supabase
    .from("event_tickets")
    .select("*, ticket_info:tickets(*)")
    .eq("event_id", eventData.id);

  const { data: tablesData, error: tablesError } = await supabase
    .from("event_vendors")
    .select("*, table_info:tables(*)")
    .eq("event_id", eventData.id);

  let ticketSales = 0;
  let ticketsSold = 0;
  let tableSales = 0;
  let tablesSold = 0;

  ticketsData?.map((ticket) => {
    ticketSales += ticket.ticket_info.price;
    ticketsSold += 1;
  });

  tablesData?.map((table) => {
    if (table.payment_status === "PAID") {
      tablesSold += 1;
      tableSales += table.table_quantity * table.table_info.price;
    }
  });

  return (
    <div className="lg:grid grid-cols-4 gap-6 min-h-[calc(100vh-24rem)] flex flex-col">
      <Link
        href={`/host/events/${event}/attendees`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <h1 className="font-semibold text-3xl">Attendees</h1>
        <h1 className="text-7xl">{ticketsSold}</h1>
      </Link>
      <Link
        href={`/host/events/${event}/attendees`}
        className="bg-secondary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group "
      >
        <h1 className="font-semibold text-3xl">Total Sales</h1>
        <h1 className="text-7xl">${ticketSales + tableSales}</h1>
      </Link>
      <Link
        href={`/host/events/${event}/vendors`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <h1 className="font-semibold text-3xl">Vendors</h1>
        <h1 className="text-7xl">
          {tablesSold} <span className="text-3xl">paid</span>
        </h1>
      </Link>

      <Link
        href={`/host/events/${event}/message`}
        className="bg-secondary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group "
      >
        <h1 className="font-semibold text-3xl">Message Center</h1>
        <h1 className="text-7xl">1</h1>
      </Link>
      <div className="lg:col-span-2 bg-secondary rounded-md">
        <h1></h1>
      </div>
      <div className="lg:col-span-2 bg-secondary rounded-md">
        <h1></h1>
      </div>
    </div>
  );
}
