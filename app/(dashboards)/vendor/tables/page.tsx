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
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <p className="text-sm">
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
            <Dialog>
              <DialogTrigger asChild>
                <div
                  key={eventDisplay.id}
                  className="hover:translate-y-[-.5rem] hover:cursor-pointer transition duration-500 relative border flex flex-col rounded-lg p-6 gap-4"
                >
                  <div className="flex gap-4">
                    {applicationInfo.application_status === "ACCEPTED" ? (
                      <h2
                        className={cn(
                          "p-2 text-sm rounded-md",
                          colorInfo.paymentStatusBG
                        )}
                      >
                        {applicationInfo.payment_status}
                      </h2>
                    ) : null}
                    <h2
                      className={cn(
                        "p-2 text-sm rounded-md",
                        colorInfo.applicationStatusBG
                      )}
                    >
                      {applicationInfo.application_status}
                    </h2>
                  </div>
                  <EventCard
                    clickable={false}
                    user={user}
                    showLikeButton={false}
                    event={eventDisplay}
                    showTicketIcon={false}
                  />

                  <div
                    key={tableInfo.section_name}
                    className="flex items-center gap-4"
                  >
                    <div className="flex space-x-2">
                      <TicketIcon className="stroke-1 text-primary" size={24} />
                      <p>{tableInfo.section_name}</p>
                      <p>x{applicationInfo.table_quantity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Users2Icon size={24} className="text-primary stroke-1" />
                      <p>x{applicationInfo.vendors_at_table}</p>
                    </div>
                  </div>
                  <div className="dark:bg-foreground dark:text-background border-foreground dark:border-none">
                    <h5 className="text-md font-semibold mb-2">
                      Vendor Check-In Information:
                    </h5>
                    <div className="space-y-1">
                      <LabeledText label="Location">
                        {generalInfo?.check_in_location || "N/A"}
                      </LabeledText>
                      <LabeledText label="Check In Time">
                        {generalInfo?.check_in_time
                          ? convertToStandardTime(generalInfo?.check_in_time)
                          : "N/A"}
                      </LabeledText>
                      <LabeledText label="Wifi Availability">
                        {generalInfo?.wifi_availability ? "Yes" : "No"}
                      </LabeledText>
                      <LabeledText label="Additional Information">
                        {generalInfo?.additional_information || "None"}
                      </LabeledText>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              {applicationInfo.application_status === "ACCEPTED" &&
                applicationInfo.payment_status === "PAID" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Table Confirmation</DialogTitle>
                      <DialogDescription>
                        Show this confirmation to the event organizer to claim
                        your table.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <p className="font-semibold">Name: </p>
                        <p>
                          {profile!.first_name} {profile!.last_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Business Name: </p>
                        <p>{profile!.business_name || "N/A"}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Table Section: </p>
                        <p>{tableInfo.section_name}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Table Quantity: </p>
                        <p>{applicationInfo.table_quantity}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Vendors at Table: </p>
                        <p>{applicationInfo.vendors_at_table}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Inventory: </p>
                        <p>{applicationInfo.inventory}</p>
                      </div>
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        asChild
                        variant="outline"
                        className="flex gap-1 group hover:bg-primary"
                      >
                        <Link href={`/events/${eventDisplay.cleaned_name}`}>
                          <span>Go to Event</span>
                          <ArrowUpRight
                            size={20}
                            className="group-hover:translate-x-[0.10rem] group-hover:-translate-y-[0.10rem] transition duration-300"
                          />
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                )}
            </Dialog>
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
            <Dialog>
              <DialogTrigger asChild>
                <div
                  key={eventDisplay.id}
                  className="hover:translate-y-[-.5rem] hover:cursor-pointer transition duration-500 relative border flex flex-col rounded-lg p-6 gap-4"
                >
                  <div className="flex gap-4">
                    {applicationInfo.application_status === "ACCEPTED" ? (
                      <h2
                        className={cn(
                          "p-2 text-sm rounded-md",
                          colorInfo.paymentStatusBG
                        )}
                      >
                        {applicationInfo.payment_status}
                      </h2>
                    ) : null}
                    <h2
                      className={cn(
                        "p-2 text-sm rounded-md",
                        colorInfo.applicationStatusBG
                      )}
                    >
                      {applicationInfo.application_status}
                    </h2>
                  </div>
                  <EventCard
                    clickable={false}
                    user={user}
                    showLikeButton={false}
                    event={eventDisplay}
                    showTicketIcon={false}
                  />

                  <div
                    key={tableInfo.section_name}
                    className="flex items-center gap-4"
                  >
                    <div className="flex space-x-2">
                      <TicketIcon className="stroke-1 text-primary" size={24} />
                      <p>{tableInfo.section_name}</p>
                      <p>x{applicationInfo.table_quantity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Users2Icon size={24} className="text-primary stroke-1" />
                      <p>x{applicationInfo.vendors_at_table}</p>
                    </div>
                  </div>
                  <div className="dark:bg-foreground dark:text-background border-foreground dark:border-none">
                    <h5 className="text-md font-semibold mb-2">
                      Vendor Check-In Information:
                    </h5>
                    <div className="space-y-1">
                      <LabeledText label="Location">
                        {generalInfo?.check_in_location || "N/A"}
                      </LabeledText>
                      <LabeledText label="Check In Time">
                        {generalInfo?.check_in_time
                          ? convertToStandardTime(generalInfo?.check_in_time)
                          : "N/A"}
                      </LabeledText>
                      <LabeledText label="Wifi Availability">
                        {generalInfo?.wifi_availability ? "Yes" : "No"}
                      </LabeledText>
                      <LabeledText label="Additional Information">
                        {generalInfo?.additional_information || "None"}
                      </LabeledText>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              {applicationInfo.application_status === "ACCEPTED" &&
                applicationInfo.payment_status === "PAID" && (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Table Confirmation</DialogTitle>
                      <DialogDescription>
                        Show this confirmation to the event organizer to claim
                        your table.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <p className="font-semibold">Name: </p>
                        <p>
                          {profile!.first_name} {profile!.last_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Business Name: </p>
                        <p>{profile!.business_name || "N/A"}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Table Section: </p>
                        <p>{tableInfo.section_name}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Table Quantity: </p>
                        <p>{applicationInfo.table_quantity}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Vendors at Table: </p>
                        <p>{applicationInfo.vendors_at_table}</p>
                      </div>
                      <div className="flex space-x-2">
                        <p className="font-semibold">Inventory: </p>
                        <p>{applicationInfo.inventory}</p>
                      </div>
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        asChild
                        variant="outline"
                        className="flex gap-1 group hover:bg-primary"
                      >
                        <Link href={`/events/${eventDisplay.cleaned_name}`}>
                          <span>Go to Event</span>
                          <ArrowUpRight
                            size={20}
                            className="group-hover:translate-x-[0.10rem] group-hover:-translate-y-[0.10rem] transition duration-300"
                          />
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                )}
            </Dialog>
          )
        )}
      </div>
    </>
  );
}
