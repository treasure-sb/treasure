import { Tables } from "@/types/supabase";
import SalesChart from "./SalesChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/lib/utils";
import DateFilter from "./DateFilter";

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
  normalizedDate: string;
  tickets: number;
  tables: number;
}[];

const normalizeDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
};

export default async function SalesAnalytics({
  periodLength,
}: {
  periodLength: number;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: ordersData } = await supabase
    .from("orders")
    .select("created_at, amount_paid, line_items(*)");

  const orders: OrderQueryData = ordersData || [];
  const today = new Date();
  const lastThirtyDaysMap = new Map<string, SalesMapValue>();

  Array.from({ length: periodLength }).forEach((_, i) => {
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
      normalizedDate: key,
      tickets: value.tickets,
      tables: value.tables,
    });
  });

  salesData.reverse();

  return (
    <div className="h-80 md:h-[29rem] col-span-2 bg-secondary dark:bg-[#0d0d0c] rounded-md p-6 py-4 pb-10 border-[1px] border-secondary">
      <div className="flex space-x-2 items-end justify-between mb-4">
        <h3 className="text-2xl font-semibold">
          Sales Analytics{" "}
          <span className="text-muted-foreground text-base">
            actual amount paid (not including fees)
          </span>
        </h3>
        <DateFilter />
      </div>

      <SalesChart salesData={salesData} periodLength={periodLength} />
    </div>
  );
}
