import { DataTable } from "./DataTable";
import { columns, Order } from "./OrderDataColumns";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { type CustomerData } from "../../types";
import { Suspense } from "react";
import DateRangeFilter from "./DateRangeFilter";
import createSupabaseServerClient from "@/utils/supabase/server";

type OrderData = Tables<"orders"> & {
  profile: Tables<"profiles">;
} & {
  line_items: Tables<"line_items">[];
};

export default async function Orders({
  event,
  from,
  to,
}: {
  event: Tables<"events">;
  from?: string;
  to?: string;
}) {
  const supabase = await createSupabaseServerClient();

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
    <>
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Orders <span className="text-muted-foreground">{orders.length}</span>
        </h2>
        <Suspense>
          <DateRangeFilter />
        </Suspense>
      </div>
      <DataTable columns={columns} data={tableData} event={event} />
    </>
  );
}
