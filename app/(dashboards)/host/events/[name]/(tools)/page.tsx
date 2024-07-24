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
  LucideIcon,
} from "lucide-react";

type AttendeeCountData =
  Database["public"]["Functions"]["get_attendee_count"]["Returns"];

type ToolOptionButtonProps = {
  title: string;
  Icon: LucideIcon;
  href: string;
  stat?: string;
  subtext?: string;
};

const ToolOptionButton = ({
  title,
  Icon,
  href,
  stat,
  subtext,
}: ToolOptionButtonProps) => (
  <Link
    href={`/host/events/${href}`}
    className="bg-secondary text-foreground flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 border-[1px] hover:bg-secondary/60 hover:border-[1px] hover:border-primary/30 transition duration-300"
  >
    <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
      <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
        {title}
      </h3>
      <Icon size={28} className="flex-shrink-0" />
    </div>
    <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
      {stat} <span className="text-xl">{subtext}</span>
    </p>
  </Link>
);

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

  const hostToolsOptions = [
    {
      title: "Attendees",
      Icon: UsersIcon,
      href: `${name}/attendees`,
      stat: attendeeCount.toString(),
    },
    {
      title: "Total Sales",
      Icon: BadgeDollarSign,
      href: `${name}/sales`,
      stat: totalSales.toFixed(2),
    },
    {
      title: "Vendors",
      Icon: Star,
      href: `${name}/vendors`,
      stat: tablesSold.toString(),
      subtext: "paid",
    },
    {
      title: "Page Views",
      Icon: AppWindowIcon,
      href: `${name}/views`,
      stat: viewCount.toString(),
      subtext: "this week",
    },
    {
      title: "Message",
      Icon: MessageCircle,
      href: `${name}/message`,
    },
  ];

  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      {hostToolsOptions.map((option) => (
        <ToolOptionButton key={option.title} {...option} />
      ))}
      <SalesAnalytics event={event} periodLength={length} />
      <VendorBreakdown event={event} />
    </div>
  );
}
