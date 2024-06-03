import { DataTable } from "./components/DataTable";
import { columns, Order } from "./components/OrderDataColumns";
import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { type CustomerData } from "./types";
import createSupabaseServerClient from "@/utils/supabase/server";

type OrderData = Tables<"orders"> & {
  profile: Tables<"profiles">;
} & {
  line_items: Tables<"line_items">[];
};

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

  if (eventError) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData;

  const { data: orderData } = await supabase
    .from("orders")
    .select("*, profile:profiles(*), line_items(*)")
    .eq("event_id", event.id);

  const orders: OrderData[] = orderData || [];

  const tableDataPromise: Promise<Order>[] = orders.map(async (order) => {
    const publicAvatarUrl = await getProfileAvatar(order.profile.avatar_url);
    const customer: CustomerData = { ...order.profile, publicAvatarUrl };
    return {
      orderID: order.id,
      quantity: order.line_items[0].quantity,
      amountPaid: order.amount_paid,
      type: order.line_items[0].item_type,
      purchaseDate: new Date(order.created_at),
      customer: customer,
    };
  });

  const tableData = await Promise.all(tableDataPromise);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <DataTable columns={columns} data={tableData} event={event} />
    </div>
  );
}
