import EventDisplay from "@/components/events/shared/EventDisplay";
import { validateUser } from "@/lib/actions/auth";
import { eventDisplayData, getEventDisplayData } from "@/lib/helpers/events";
import { EventDisplayData, EventWithDates } from "@/types/event";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowUpRight, TicketIcon, Users2Icon } from "lucide-react";
import { getProfile } from "@/lib/helpers/profiles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/shared/EventCard";
import { convertToStandardTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import TableCard from "./component/TableCard";

type EventWithDatesAndVendorInfo = Tables<"event_vendors"> & {
  event: EventWithDates & {
    application_vendor_information: Tables<"application_vendor_information">;
  };
} & { table: Tables<"tables"> };
type EventDisplayVendor = {
  eventDisplay: EventDisplayData;
  tableInfo: Tables<"tables">;
  applicationInfo: Tables<"event_vendors">;
  generalInfo: Tables<"application_vendor_information">;
  colorInfo: {
    applicationStatusBG: string;
    paymentStatusBG: string;
  };
};

const LabeledText = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-sm", className)}>
      <span className="dark:text-background font-semibold">{label}:</span>{" "}
      {children}
    </p>
  );
};

const applicationStatusCheck = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
const paymentStatusCheck = (status: string) => {
  switch (status) {
    case "PAID":
      return "bg-green-500";
    case "UNPAID":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default async function Page() {
  const {
    data: { user },
  } = await validateUser();
  if (!user) return null;
  const today = new Date();

  const supabase = await createSupabaseServerClient();
  const { data: upcomingData } = await supabase
    .from("event_vendors")
    .select(
      "*, event:events!inner(*, dates:event_dates!inner(date, start_time, end_time), application_vendor_information(*)), table:tables(*)"
    )
    .eq("vendor_id", user.id)
    .gte("event.max_date", today.toISOString())
    .order("event(min_date)", { ascending: true });

  const upcomingVendorData: EventWithDatesAndVendorInfo[] = upcomingData || [];
  const upcomingTablesPromise: Promise<EventDisplayVendor>[] =
    upcomingVendorData.map(async (vendInfo) => {
      const eventDisplay = await getEventDisplayData(vendInfo.event);
      const tableInfo = vendInfo.table;
      const applicationInfo: Tables<"event_vendors"> = vendInfo;
      const generalInfo = vendInfo.event.application_vendor_information;
      const applicationStatusBG = applicationStatusCheck(
        applicationInfo.application_status
      );
      const paymentStatusBG = paymentStatusCheck(
        applicationInfo.payment_status
      );
      return {
        eventDisplay,
        tableInfo,
        applicationInfo,
        generalInfo,
        colorInfo: { applicationStatusBG, paymentStatusBG },
      };
    });
  const upcomingTables = await Promise.all(upcomingTablesPromise);

  const { data: pastData } = await supabase
    .from("event_vendors")
    .select(
      "*, event:events!inner(*, dates:event_dates!inner(date, start_time, end_time), application_vendor_information(*)), table:tables(*)"
    )
    .eq("vendor_id", user.id)
    .lt("event.max_date", today.toISOString())
    .order("event(min_date)", { ascending: false });

  const pastVendorData: EventWithDatesAndVendorInfo[] = pastData || [];
  const pastTablesPromise: Promise<EventDisplayVendor>[] = pastVendorData.map(
    async (vendInfo) => {
      const eventDisplay = await getEventDisplayData(vendInfo.event);
      const tableInfo = vendInfo.table;
      const applicationInfo: Tables<"event_vendors"> = vendInfo;
      const generalInfo = vendInfo.event.application_vendor_information;
      const applicationStatusBG = applicationStatusCheck(
        applicationInfo.application_status
      );
      const paymentStatusBG = paymentStatusCheck(
        applicationInfo.payment_status
      );
      return {
        eventDisplay,
        tableInfo,
        applicationInfo,
        generalInfo,
        colorInfo: { applicationStatusBG, paymentStatusBG },
      };
    }
  );

  const pastTables = await Promise.all(pastTablesPromise);

  const { profile } = await getProfile(user.id);

  return (
    <>
      <h1 className="font-semibold text-3xl mb-6">My Tables</h1>
      <h2 className="font-semibold">Upcoming</h2>
      <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 2xl:grid-cols-3">
        {upcomingTables.map(
          ({
            eventDisplay,
            tableInfo,
            applicationInfo,
            generalInfo,
            colorInfo,
          }) => (
            <TableCard
              eventDisplay={eventDisplay}
              tableInfo={tableInfo}
              applicationInfo={applicationInfo}
              generalInfo={generalInfo}
              colorInfo={colorInfo}
              profile={profile}
            />
          )
        )}
      </div>
      <h2 className="font-semibold">Past</h2>
      <div className="flex flex-col space-y-2 md:grid md:grid-cols-2 md:space-y-0 md:gap-2 2xl:grid-cols-3">
        {pastTables.map(
          ({
            eventDisplay,
            tableInfo,
            applicationInfo,
            generalInfo,
            colorInfo,
          }) => (
            <TableCard
              eventDisplay={eventDisplay}
              tableInfo={tableInfo}
              applicationInfo={applicationInfo}
              generalInfo={generalInfo}
              colorInfo={colorInfo}
              profile={profile}
            />
          )
        )}
      </div>
    </>
  );
}
