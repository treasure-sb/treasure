import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import ViewsChart from "./components/ViewsChart";
import createSupabaseServerClient from "@/utils/supabase/server";
import { formatDate } from "@/lib/utils";

const normalizeDate = (date: Date) => {
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
};

export type ViewsChartData = {
  day: string;
  formattedDate: string;
  views: number;
}[];

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

  const { data: viewsData } = await supabase
    .from("event_views")
    .select("*")
    .eq("event_id", event.id);

  const views: Tables<"event_views">[] = viewsData || [];

  const today = new Date();
  const lastSevenDaysMap = new Map<string, any>();

  Array.from({ length: 7 }).forEach((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    lastSevenDaysMap.set(normalizeDate(date), 0);
  });

  views.forEach((view) => {
    const viewDate = normalizeDate(new Date(view.visited_at));
    if (lastSevenDaysMap.has(viewDate)) {
      const itemMap = lastSevenDaysMap.get(viewDate);
      lastSevenDaysMap.set(viewDate, itemMap + 1);
    }
  });

  const viewsChartData: ViewsChartData = [];
  lastSevenDaysMap.forEach((value, key) => {
    viewsChartData.push({
      day: new Date(key).getDate().toString(),
      formattedDate: formatDate(key),
      views: value,
    });
  });

  viewsChartData.reverse();

  return (
    <div className="max-w-7xl mx-auto py-10">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between mb-4">
        <h1 className="text-2xl font-semibold">Page Views</h1>
      </div>
      <ViewsChart data={viewsChartData} />
    </div>
  );
}
