import createSupabaseServerClient from "@/utils/supabase/server";
import Revenue from "./components/charts/Revenue";
import { USDollar } from "@/lib/utils";
import { validateUser } from "@/lib/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpcomingEvents from "./components/UpcomingEvents";
import PendingVendors from "./components/PendingVendors";
import VerifiedVendors from "./components/VerifiedVendors";

export type RevenueQueryData = {
  created_at: string;
  amount_paid: number;
  event: {
    event_roles: {
      user_id: string;
      role: string;
      status: string;
    }[];
  };
};

type StatCardProps = {
  title: string;
  description?: string;
  content: string;
};

const StatCard = ({ title, description, content }: StatCardProps) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>
      <p className="text-lg">{content}</p>
    </CardContent>
  </Card>
);

export default async function Page() {
  const {
    data: { user },
  } = await validateUser();

  const supabase = await createSupabaseServerClient();
  const { data: ordersData } = await supabase
    .from("orders")
    .select(
      "created_at, amount_paid, event:events!inner(event_roles!inner(user_id, role, status))"
    )
    .eq("event.event_roles.user_id", user!.id)
    .in("event.event_roles.role", ["HOST", "COHOST", "STAFF"])
    .eq("event.event_roles.status", "ACTIVE")
    .returns<RevenueQueryData[]>();

  const revenueData: RevenueQueryData[] = ordersData || [];
  const totalRevenue = revenueData.reduce(
    (amount, item) => amount + item.amount_paid,
    0
  );

  const { count } = await supabase
    .from("events")
    .select("name, event_roles!inner(user_id, role, status)", {
      count: "exact",
      head: true,
    })
    .eq("event_roles.user_id", user!.id)
    .in("event_roles.role", ["HOST", "COHOST", "STAFF", "SCANNER"])
    .eq("event_roles.status", "ACTIVE");

  const { data: attendeeCountData } = await supabase.rpc(
    "get_all_events_attendees_count",
    {
      user_id: user!.id,
    }
  );

  const totalAttendeeCount = attendeeCountData || 0;
  const totalEventCount = count || 0;

  const hostStats: StatCardProps[] = [
    {
      title: "Total Revenue",
      content: USDollar.format(totalRevenue),
    },
    {
      title: "Total Events",
      content: totalEventCount.toString(),
    },
    {
      title: "Total Attendees",
      content: totalAttendeeCount.toString(),
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-semibold text-2xl mb-2">Host Dashboard</h1>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <Revenue user={user!} />
        <div className="md:h-[29rem] flex flex-col justify-between space-y-4">
          {hostStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        <UpcomingEvents user={user!} />
        <PendingVendors user={user!} />
        <VerifiedVendors user={user!} />
      </div>
    </div>
  );
}
