import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import ViewsChart from "./components/ViewsChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import DateFilter from "./components/DateFilter";

const subtractFourHours = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - 4);
  return newDate;
};

const normalizeDate = (date: Date) => {
  const adjustedDate = subtractFourHours(date);
  adjustedDate.setHours(0, 0, 0, 0);
  return adjustedDate.toISOString().slice(0, 10);
};

const percentageChange = (current: number, last: number) => {
  return ((current - last) / last) * 100;
};

export type ViewsChartData = {
  day: string;
  formattedDate: string;
  normalizedDate: string;
  views: number;
}[];

export default async function Page({
  params: { name },
  searchParams: { period },
}: {
  params: { name: string };
  searchParams: { period?: string };
}) {
  const length = period === "30d" ? 30 : period === "24h" ? 1 : 7;
  const today = new Date();
  const searchFromDate = new Date(today);
  searchFromDate.setDate(today.getDate() - length);
  const lastPeriodStartDate = new Date(searchFromDate);
  lastPeriodStartDate.setDate(searchFromDate.getDate() - length * 2);

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

  const { data: viewsData } = await supabase
    .from("event_views")
    .select("*")
    .eq("event_id", event.id)
    .gte("visited_at", searchFromDate.toISOString());

  const views: Tables<"event_views">[] = viewsData || [];

  const lastDaysMap = new Map<string, any>();
  Array.from({ length }).forEach((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    lastDaysMap.set(normalizeDate(date), 0);
  });

  views.forEach((view) => {
    const viewDate = normalizeDate(new Date(view.visited_at));
    if (lastDaysMap.has(viewDate)) {
      const views = lastDaysMap.get(viewDate);
      lastDaysMap.set(viewDate, views + 1);
    }
  });

  const viewsChartData: ViewsChartData = [];
  lastDaysMap.forEach((value, key) => {
    viewsChartData.push({
      day: new Date(key).getDate().toString(),
      formattedDate: formatDate(key),
      normalizedDate: key,
      views: value,
    });
  });

  viewsChartData.reverse();

  const { count: lastPeriodViewsCount } = await supabase
    .from("event_views")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id)
    .gte("visited_at", lastPeriodStartDate.toISOString())
    .lte("visited_at", searchFromDate.toISOString());

  const lastPeriodViews = lastPeriodViewsCount || 0;
  const viewCountChange = percentageChange(views.length, lastPeriodViews);
  const viewsIncrease = viewCountChange > 0;
  const isInfinity = !Number.isFinite(viewCountChange);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <div className="flex space-x-2 items-center">
          <h2 className="text-2xl font-semibold">Page Views </h2>
          <div className="text-muted-foreground text-2xl font-semibold flex items-center">
            {views.length}
          </div>
          <div
            className={cn(
              "text-xs rounded-[3px] font-semibold p-1",
              viewsIncrease || isInfinity
                ? "bg-primary/10 text-green-600"
                : "bg-destructive/10 text-red-600"
            )}
          >
            {viewsIncrease || isInfinity ? "+" : "-"}
            {isInfinity ? "∞" : Math.abs(viewCountChange).toFixed(0)}%
          </div>
        </div>
        <Suspense>
          <DateFilter />
        </Suspense>
      </div>
      <ViewsChart data={viewsChartData} period={period} />
    </div>
  );
}
