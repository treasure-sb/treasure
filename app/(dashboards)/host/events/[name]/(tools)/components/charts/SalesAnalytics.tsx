import { Tables } from "@/types/supabase";
import SalesChart from "./SalesChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/lib/utils";

type OrderQueryData = {
  created_at: string;
  amount_paid: number;
  line_items: Tables<"line_items">[];
}[];

type SalesMapValue = {
  tickets: number;
  tables: number;
};

export type SalesData = {
  day: string;
  formattedDate: string;
  tickets: number;
  tables: number;
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
  const { data: ordersData } = await supabase
    .from("orders")
    .select("created_at, amount_paid, line_items(*)")
    .eq("event_id", event.id);

  const orders: OrderQueryData = ordersData || [];
  const today = new Date();
  const lastThirtyDaysMap = new Map<string, SalesMapValue>();

  Array.from({ length: 30 }).forEach((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    lastThirtyDaysMap.set(normalizeDate(date), { tickets: 0, tables: 0 });
  });

  orders.forEach((order) => {
    const saleDate = normalizeDate(new Date(order.created_at));
    if (lastThirtyDaysMap.has(saleDate)) {
      order.line_items.forEach((item) => {
        const itemType = item.item_type;
        const itemMap = lastThirtyDaysMap.get(saleDate)!;
        if (itemType === "TICKET") {
          itemMap.tickets += item.price * item.quantity;
        } else {
          itemMap.tables += item.price * item.quantity;
        }
      });
    }
  });

  const salesData: SalesData = [];
  lastThirtyDaysMap.forEach((value, key) => {
    salesData.push({
      day: new Date(key).getDate().toString(),
      formattedDate: formatDate(key),
      tickets: value.tickets,
      tables: value.tables,
    });
  });

  salesData.reverse();

  return <SalesChart salesData={salesData} />;
}
