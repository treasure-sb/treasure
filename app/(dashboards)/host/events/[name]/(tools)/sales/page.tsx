import { DataTable } from "./components/DataTable";
import { columns, Order } from "./components/OrderDataColumns";
import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { type CustomerData } from "./types";
import DateRangeFilter from "./components/DateRangeFilter";
import createSupabaseServerClient from "@/utils/supabase/server";

type OrderData = Tables<"orders"> & {
  profile: Tables<"profiles">;
} & {
  line_items: Tables<"line_items">[];
};

export default async function Page({
  params: { name },
  searchParams: { from, to },
}: {
  params: { name: string };
  searchParams: { from?: string; to?: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData;

  let orderQuery = supabase
    .from("orders")
    .select("*, profile:profiles(*), line_items(*)")
    .eq("event_id", event.id)
    .order("created_at", { ascending: false });

  if (from) {
    orderQuery = orderQuery.gte("created_at", from);
  }
  if (to) {
    orderQuery = orderQuery.lte("created_at", to);
  }

  const { data: orderData } = await orderQuery;
  const orders: OrderData[] = orderData || [];

  const tableDataPromise: Promise<Order>[] = orders.map(async (order) => {
    const publicAvatarUrl = await getProfileAvatar(order.profile.avatar_url);
    const customer: CustomerData = { ...order.profile, publicAvatarUrl };
    const item = order.line_items[0];

    let itemName = "";
    if (item.item_type === "TICKET") {
      const { data: ticketData } = await supabase
        .from("tickets")
        .select("name")
        .eq("id", item.item_id)
        .single();
      itemName = ticketData?.name;
    } else {
      const { data: tableData } = await supabase
        .from("tables")
        .select("section_name")
        .eq("id", item.item_id)
        .single();
      itemName = tableData?.section_name;
    }

    return {
      orderID: order.id,
      quantity: order.line_items[0].quantity,
      amountPaid: order.amount_paid,
      type: order.line_items[0].item_type,
      purchaseDate: new Date(order.created_at),
      itemName: itemName,
      customer: customer,
    };
  });

  const tableData = await Promise.all(tableDataPromise);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold mb-4">
          Orders <span className="text-muted-foreground">{orders.length}</span>
        </h1>
        <DateRangeFilter />
      </div>
      <DataTable columns={columns} data={tableData} event={event} />
    </div>
  );
}
