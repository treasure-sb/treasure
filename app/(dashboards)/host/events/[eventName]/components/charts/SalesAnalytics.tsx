import { Tables } from "@/types/supabase";
import SalesChart from "./SalesChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/lib/helpers/events";

type TicketSoldData = {
  created_at: string;
  tickets: { price: number };
}[];

export type SalesData = {
  day: string;
  formattedDate: string;
  sales: number;
}[];

const normalizeDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
};

export default async function SalesAnalytics({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: ticketSoldData } = await supabase
    .from("event_tickets")
    .select("created_at, tickets(price)")
    .eq("event_id", event.id)
    .returns<TicketSoldData>();

  const today = new Date();
  const lastThirtyDaysMap = new Map<string, number>();

  Array.from({ length: 30 }).forEach((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    lastThirtyDaysMap.set(normalizeDate(date), 0);
  });

  ticketSoldData?.forEach((sale) => {
    const saleDate = normalizeDate(new Date(sale.created_at));
    const ticketPrice = sale.tickets.price;
    lastThirtyDaysMap.set(
      saleDate,
      lastThirtyDaysMap.has(saleDate)
        ? lastThirtyDaysMap.get(saleDate)! + ticketPrice
        : 0
    );
  });

  const salesData: SalesData = [];
  lastThirtyDaysMap.forEach((value, key) => {
    salesData.push({
      day: new Date(key).getDate().toString(),
      formattedDate: formatDate(key),
      sales: value,
    });
  });

  salesData.reverse();

  return <SalesChart salesData={salesData} />;
}
