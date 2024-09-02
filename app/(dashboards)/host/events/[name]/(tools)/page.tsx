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
import { USDollar } from "@/lib/utils";
import { validateUser } from "@/lib/actions/auth";
import { RoleMapKey } from "./team/components/ListMembers";
import { getEventFromCleanedName } from "@/lib/helpers/events";

type AttendeeCountData =
  Database["public"]["Functions"]["get_attendee_count"]["Returns"];

type ToolOptionButtonProps = {
  title: string;
  Icon: LucideIcon;
  href: string;
  inactive: boolean;
  stat?: string;
  subtext?: string;
};

const ToolOptionButton = ({
  title,
  Icon,
  href,
  inactive,
  stat,
  subtext,
}: ToolOptionButtonProps) => {
  const commonClasses =
    "bg-secondary/30 text-foreground flex flex-col rounded-md p-6 lg:p-4 2xl:p-6 relative group h-44 border-[1px] transition duration-300";
  const activeClasses =
    "hover:bg-secondary/60 hover:border-[1px] hover:border-primary/30";
  const inactiveClasses = "opacity-50 cursor-not-allowed";

  const content = (
    <>
      <div className="flex lg:flex-col-reverse 3xl:flex-row justify-between">
        <h3 className="font-semibold text-2xl lg:text-lg 2xl:text-2xl">
          {title}
        </h3>
        <Icon size={28} className="flex-shrink-0 lg:mb-2 3xl:mb-0" />
      </div>
      <p className="text-5xl lg:hidden 2xl:block 2xl:text-2xl 3xl:text-3xl">
        {stat ? (inactive ? "--" : stat) : null}{" "}
        <span className="text-xl">{subtext}</span>
      </p>
    </>
  );

  if (inactive) {
    return (
      <div className={`${commonClasses} ${inactiveClasses}`}>{content}</div>
    );
  }

  return (
    <Link
      href={`/host/events/${href}`}
      className={`${commonClasses} ${activeClasses}`}
    >
      {content}
    </Link>
  );
};

export default async function Page({
  params: { name },
  searchParams: { period },
}: {
  params: { name: string };
  searchParams: { period?: string };
}) {
  const length = period === "30d" ? 30 : 7;

  const supabase = await createSupabaseServerClient();

  const { event } = await getEventFromCleanedName(name);

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

  const { count: totalTicketsBought } = await supabase
    .from("event_tickets")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);

  const ticketCount = totalTicketsBought || 0;

  const hostToolsOptions = [
    {
      title: "Attendees",
      Icon: UsersIcon,
      href: `${name}/attendees`,
      stat: ticketCount.toString(),
      subtext: "tickets sold",
    },
    {
      title: "Total Sales",
      Icon: BadgeDollarSign,
      href: `${name}/sales`,
      stat: `${USDollar.format(totalSales)}`,
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

  const {
    data: { user },
  } = await validateUser();

  const { data: roleData } = await supabase
    .from("event_roles")
    .select("role")
    .eq("event_id", event.id)
    .eq("user_id", user!.id)
    .single();

  const role: RoleMapKey = roleData?.role as RoleMapKey;

  return (
    <div className="lg:grid grid-cols-5 gap-4 flex flex-col">
      {hostToolsOptions.map((option) => (
        <ToolOptionButton
          key={option.title}
          inactive={role === "SCANNER" && option.title !== "Attendees"}
          {...option}
        />
      ))}
      <SalesAnalytics event={event} periodLength={length} role={role} />
      <VendorBreakdown event={event} role={role} />
    </div>
  );
}
