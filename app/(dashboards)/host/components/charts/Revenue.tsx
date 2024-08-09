import { normalizeDate } from "@/lib/utils";
import { RevenueQueryData } from "../../page";
import { User } from "@supabase/supabase-js";
import createSupabaseServerClient from "@/utils/supabase/server";
import RevenueChart from "./RevenueChart";

type RevenueMapValue = {
  amount: number;
};

export type RevenueData = {
  day: string;
  formattedDate: string;
  normalizedDate: string;
  amount: number;
};

export default async function Revenue({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "created_at, amount_paid, event:events!inner(event_roles!inner(role, status))"
    )
    .eq("event.event_roles.user_id", user!.id)
    .in("event.event_roles.role", ["HOST", "COHOST", "STAFF"])
    .eq("event.event_roles.status", "ACTIVE")
    .returns<RevenueQueryData[]>();

  const revenueData: RevenueQueryData[] = data || [];
  const revenueChartData: RevenueData[] = [];

  const today = new Date();
  const lastDaysMap = new Map<string, RevenueMapValue>();

  Array.from({ length: 30 }).forEach((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    lastDaysMap.set(normalizeDate(date), { amount: 0 });
  });

  revenueData.forEach((revenue) => {
    const revenueDate = normalizeDate(new Date(revenue.created_at));
    if (lastDaysMap.has(revenueDate)) {
      const amount = lastDaysMap.get(revenueDate)!;
      lastDaysMap.set(revenueDate, {
        amount: amount.amount + revenue.amount_paid,
      });
    }
  });

  lastDaysMap.forEach((value, key) => {
    revenueChartData.push({
      day: new Date(key).getDate().toString(),
      formattedDate: new Date(key).toLocaleDateString(),
      normalizedDate: key,
      amount: value.amount,
    });
  });

  revenueChartData.reverse();

  return (
    <div
      className={`h-80 md:h-[29rem] col-span-2 bg-[#0d0d0c] rounded-md p-6 py-4 pb-10 border-[1px] border-secondary flex-1`}
    >
      <div className="flex space-x-2 items-end justify-between mb-4">
        <h3 className="text-2xl font-semibold">Revenue</h3>
      </div>
      <RevenueChart revenueData={revenueChartData} periodLength={30} />
    </div>
  );
}
