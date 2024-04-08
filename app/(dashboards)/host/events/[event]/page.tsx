import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";

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
  let tableSales = 0;
  let tablesSold = 0;

  ticketsData?.map((ticket) => {
    ticketSales += ticket.ticket_info.price;
  });

  tablesData?.map((table) => {
    if (table.payment_status === "PAID") {
      tablesSold += 1;
      tableSales += table.table_quantity * table.table_info.price;
    }
  });

  return (
    <div className="lg:grid grid-cols-3 gap-6 min-h-[calc(100vh-24rem)] flex flex-col">
      <div className="bg-secondary rounded-md col-span-2 p-6 lg:p-10 relative group">
        <h1 className="font-semibold text-3xl">Sales</h1>
        <div className="flex flex-col gap-2 m-4 w-fit text-lg">
          <div className="flex justify-between gap-10">
            <h1>Tickets</h1> <h1>${ticketSales}</h1>
          </div>
          <div className="flex justify-between gap-10">
            <h1>Tables</h1> <h1>${tableSales}</h1>
          </div>
          <div className="flex justify-between gap-10 font-semibold text-xl">
            <h1>Total</h1> <h1>${ticketSales + tableSales}</h1>
          </div>
        </div>
      </div>
      <Link
        href={`/host/events/${event}/vendors`}
        className="border border-primary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500 rounded-md" />
        <h1 className="font-semibold text-3xl">Vendors</h1>
      </Link>
      <Link
        href={`/host/events/${event}/attendees`}
        className="border border-primary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group "
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500" />
        <h1 className="font-semibold text-3xl">Tickets / Attendees</h1>
      </Link>
      <Link
        href={`/host/events/${event}/message`}
        className="border border-primary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500" />
        <h1 className="font-semibold text-3xl">Message Guests</h1>
      </Link>
      <Link
        href={`/host/events/${event}/edit`}
        className="border border-primary rounded-md p-6 lg:p-10 hover:translate-y-[-0.5rem] transition duration-500 relative group"
      >
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-50 transition duration-500" />
        <h1 className="font-semibold text-3xl">Event Info</h1>
      </Link>
    </div>
  );
}
