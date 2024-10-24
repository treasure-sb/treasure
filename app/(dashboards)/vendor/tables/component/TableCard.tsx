import EventDisplay from "@/components/events/shared/EventDisplay";
import { validateUser } from "@/lib/actions/auth";
import { eventDisplayData, getEventDisplayData } from "@/lib/helpers/events";
import { EventDisplayData, EventWithDates } from "@/types/event";
import { Tables } from "@/types/supabase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  ArrowUpRight,
  TicketIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/shared/EventCard";
import { convertToStandardTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/actions/checkout";

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

export default async function TableCard({
  eventDisplay,
  tableInfo,
  applicationInfo,
  generalInfo,
  colorInfo,
  profile,
}: {
  eventDisplay: EventDisplayData;
  tableInfo: Tables<"tables">;
  applicationInfo: Tables<"event_vendors">;
  generalInfo: Tables<"application_vendor_information">;
  colorInfo: { applicationStatusBG: string; paymentStatusBG: string };
  profile: Tables<"profiles"> | null;
}) {
  let checkoutSessionID = "";
  if (
    applicationInfo.application_status === "ACCEPTED" &&
    applicationInfo.payment_status === "UNPAID"
  ) {
    const { data: checkoutSessionData, error: checkoutSessionError } =
      await createCheckoutSession({
        event_id: eventDisplay.id,
        ticket_id: tableInfo.id,
        ticket_type: "TABLE",
        user_id: profile?.id || null,
        quantity: applicationInfo.table_quantity,
      });
    checkoutSessionID = checkoutSessionData?.id || "";
  }

  return (
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
            showLikeButton={false}
            event={eventDisplay}
            showTicketIcon={false}
          />

          <div key={tableInfo.section_name} className="flex items-center gap-4">
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
            <div className="flex flex-col gap-1">
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
              <LabeledText label="Additional General Info">
                {generalInfo?.additional_information || "None"}
              </LabeledText>
              <LabeledText label="Section Name" className="mt-3">
                {tableInfo?.section_name || "N/A"}
              </LabeledText>
              <LabeledText label="Space Allocated Per Table">
                {tableInfo?.space_allocated || "0"}ft
              </LabeledText>
              <LabeledText label="Table Quantity">
                {applicationInfo?.table_quantity || "N/A"}
              </LabeledText>
              <LabeledText label="Table Provided">
                {tableInfo?.table_provided ? "Yes" : "No"}
              </LabeledText>
              <LabeledText label="Additional Table Info">
                {tableInfo?.additional_information || "None"}
              </LabeledText>
            </div>
          </div>
        </div>
      </DialogTrigger>
      {applicationInfo.application_status === "ACCEPTED" && (
        <DialogContent>
          {applicationInfo.payment_status === "PAID" ? (
            <>
              <DialogHeader>
                <DialogTitle>Table Confirmation</DialogTitle>
                <DialogDescription>
                  Show this confirmation to the event organizer to claim your
                  table.
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
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex gap-2 items-end">
                    <AlertTriangle color="#f97316" />
                    <h1 className="text-orange-500">Action Required</h1>
                  </div>
                </DialogTitle>
                <DialogDescription className="flex flex-col">
                  <p>Your application has been accepted.</p>
                  <p>Until payment is received, your spot is not guaranteed.</p>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-1">
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
              <div className="flex w-full justify-end gap-2">
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
                <Button
                  asChild
                  variant="outline"
                  className="flex gap-1 group hover:bg-primary"
                >
                  <Link href={`/checkout/${checkoutSessionID}`}>
                    <span>Make Payment</span>
                    <ArrowUpRight
                      size={20}
                      className="group-hover:translate-x-[0.10rem] group-hover:-translate-y-[0.10rem] transition duration-300"
                    />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
