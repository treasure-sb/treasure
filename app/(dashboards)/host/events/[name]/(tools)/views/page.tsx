import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import { formatDate, normalizeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import ViewsChart from "./components/ViewsChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import DateFilter from "./components/DateFilter";
import { getEventFromCleanedName } from "@/lib/helpers/events";

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
  searchFromDate.setHours(0, 0, 0, 0);
  searchFromDate.setDate(searchFromDate.getDate() - length);
  const lastPeriodStartDate = new Date(searchFromDate);
  lastPeriodStartDate.setDate(searchFromDate.getDate() - length * 2);
  let totalViews = 0;

  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromCleanedName(name);

  if (eventError) {
    redirect("/host/events");
  }

  const { data: viewsData, error } = await supabase
    .from("event_views_consolidated")
    .select("*")
    .eq("event_id", event.id)
    .gte("date", searchFromDate.toISOString())
    .order("date", { ascending: true });

  const views: Tables<"event_views_consolidated">[] = viewsData || [];

  const viewsChartData: ViewsChartData = [];
  views.map((day) => {
    viewsChartData.push({
      day: new Date(day.date).getDate().toString(),
      formattedDate: formatDate(day.date),
      normalizedDate: day.date,
      views: day.num_views,
    });
    totalViews += day.num_views;
  });

  const { count: lastPeriodViewsCount } = await supabase
    .from("event_views")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id)
    .gte("visited_at", lastPeriodStartDate.toISOString())
    .lte("visited_at", searchFromDate.toISOString());

  const lastPeriodViews = lastPeriodViewsCount || 0;
  const viewCountChange = percentageChange(totalViews, lastPeriodViews);
  const viewsIncrease = viewCountChange > 0;
  const isInfinity = !Number.isFinite(viewCountChange);

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4 ">
        <div className="flex space-x-2 items-center">
          <h2 className="text-2xl font-semibold">Page Views </h2>
          <div className="text-muted-foreground text-2xl font-semibold flex items-center">
            {totalViews}
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
