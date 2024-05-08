import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import SalesChart from "./components/SalesChart";
import VendorsChart from "./components/VendorsChart";
import { Tables } from "@/types/supabase";
import { UsersIcon, BadgeDollarSign, Star, MessageCircle } from "lucide-react";
import VendorBreakdown from "./components/VendorBreakdown";

export default async function Page({
  params: { eventName },
}: {
  params: { eventName: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();

  const event: Tables<"events"> = eventData;

  const { data: ticketsData } = await supabase
    .from("event_tickets")
    .select("*, ticket_info:tickets(*)")
    .eq("event_id", event.id);

  const { data: tablesData } = await supabase
    .from("event_vendors")
    .select("*, table_info:tables(*)")
    .eq("event_id", event.id);

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
    <div className="lg:grid grid-cols-4 gap-4 flex flex-col">
      <Link
        href={`/host/events/${eventName}/attendees`}
        className="bg-primary text-black flex flex-col rounded-md p-6 md:p-8 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Attendees
          </h3>
          <UsersIcon size={28} />
        </div>
        <p className="text-5xl lg:text-3xl 2xl:text-4xl">{ticketsSold}</p>
      </Link>
      <Link
        href={`/host/events/${eventName}/attendees`}
        className="bg-secondary rounded-md p-6 lg:p-8 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Total Sales
          </h3>
          <BadgeDollarSign size={28} />
        </div>
        <p className="text-5xl lg:text-3xl 2xl:text-4xl">
          ${(ticketSales + tableSales).toFixed(2)}
        </p>
      </Link>
      <Link
        href={`/host/events/${eventName}/vendors`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-8 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Vendors
          </h3>
          <Star size={28} />
        </div>
        <p className="text-5xl lg:text-3xl 2xl:text-4xl">
          {tablesSold} <span className="text-3xl">paid</span>
        </p>
      </Link>
      <Link
        href={`/host/events/${eventName}/message`}
        className="bg-secondary rounded-md p-6 lg:p-8 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 2xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Message
          </h3>
          <MessageCircle size={28} />
        </div>
      </Link>
      <SalesChart />
      <VendorBreakdown event={event} />
    </div>
  );
}
