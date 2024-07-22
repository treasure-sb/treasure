import Link from "next/link";
import createSupabaseServerClient from "@/utils/supabase/server";
import VendorBreakdown from "./components/charts/VendorBreakdown";
import SalesAnalytics from "./components/charts/SalesAnalytics";
import { Database, Tables } from "@/types/supabase";
import {
  UsersIcon,
  BadgeDollarSign,
  Star,
  MessageCircle,
  AppWindowIcon,
} from "lucide-react";

type AttendeeCountData =
  Database["public"]["Functions"]["get_attendee_count"]["Returns"];

export default async function Page({
  params: { name },
  searchParams: { period },
}: {
  params: { name: string };
  searchParams: { period?: string };
}) {
  const length = period === "30d" ? 30 : 7;

  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  const event: Tables<"events"> = eventData;

  const { data: tablesData } = await supabase
    .from("event_vendors")
    .select("*, table_info:tables(*)")
    .eq("event_id", event.id);

  let tablesSold = 0;

  tablesData?.map((table) => {
    if (table.payment_status === "PAID") {
      tablesSold += 1;
    }
  });

  const { data: ordersData } = await supabase
    .from("orders")
    .select("amount_paid")
    .eq("event_id", event.id);

  const totalSales =
    ordersData?.reduce((acc, order) => acc + order.amount_paid, 0) || 0;

  const today = new Date();
  const lastWeekStartDate = new Date(today);
  lastWeekStartDate.setDate(today.getDate() - 7);

  const { count: lastPeriodViewsCount } = await supabase
    .from("event_views")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id)
    .gte("visited_at", lastWeekStartDate.toISOString());

  const viewCount = lastPeriodViewsCount || 0;

  const { data } = await supabase.rpc("get_attendee_count", {
    event_id: eventData.id,
  });

  const attendeeCount: AttendeeCountData = data || 0;

  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      <Link
        href={`/host/events/${name}/attendees`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Attendees
          </h3>
          <UsersIcon size={28} className="flex-shrink-0" />
        </div>
        <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
          {attendeeCount}
        </p>
      </Link>
      <Link
        href={`/host/events/${name}/sales`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Total Sales
          </h3>
          <BadgeDollarSign size={28} className="flex-shrink-0" />
        </div>
        <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
          ${totalSales.toFixed(2)}
        </p>
      </Link>
      <Link
        href={`/host/events/${name}/vendors`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Vendors
          </h3>
          <Star size={28} className="flex-shrink-0" />
        </div>
        <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
          {tablesSold} <span className="text-xl">paid</span>
        </p>
      </Link>
      <Link
        href={`/host/events/${name}/views`}
        className="bg-secondary rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-secondary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Page Views
          </h3>
          <AppWindowIcon size={28} className="flex-shrink-0" />
        </div>
        <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
          {viewCount} <span className="text-xl">this week</span>
        </p>
      </Link>
      <Link
        href={`/host/events/${name}/message`}
        className="bg-primary text-black flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 hover:bg-primary/60 transition duration-300"
      >
        <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
          <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
            Message
          </h3>
          <MessageCircle size={28} className="flex-shrink-0" />
        </div>
      </Link>
      <SalesAnalytics event={event} periodLength={length} />
      <VendorBreakdown event={event} />
    </div>
  );
}
