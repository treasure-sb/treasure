"use clent";
import { cn, convertToStandardTime } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TicketIcon } from "lucide-react";
import { useVendorFlow } from "../../context/VendorFlowContext";
import TablesCounter from "./TablesCounter";
import EventCard from "@/components/events/shared/EventCard";

interface TicketInfoProps {
  type: string;
  price: number;
}

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

const TableInfo = ({ type, price }: TicketInfoProps) => (
  <div className="flex space-x-4 dark:text-background text-foreground">
    <TicketIcon className="stroke-2 dark:text-background" />
    <div className="flex">
      <p className="font-bold">{type}</p>{" "}
      <p className="ml-2 font-bold">${price.toFixed(2)}</p>
    </div>
  </div>
);

const TableInfoNoPayment = ({ type }: { type: string }) => (
  <div className="flex space-x-4 text-background items-center">
    <TicketIcon className="stroke-2 text-background" />
    <div className="flex items-center">
      <p>{type}</p>
      <p className="ml-2 text-gray-700 text-xs md:text-base">
        (Price Communicated on Approval)
      </p>
    </div>
  </div>
);

export default function AllTables() {
  const { generalVendorInfo, event, tables } = useVendorFlow();

  const tableOptions = tables.map((table, index) => (
    <AccordionItem
      className={cn(`p-4`, index === tables.length - 1 && "border-b-0")}
      key={index}
      value={`item-${index}`}
    >
      <AccordionTrigger className="dark:decoration-background dark:text-background">
        {event.vendor_exclusivity === "APPLICATIONS_NO_PAYMENT" ? (
          <TableInfoNoPayment type={table.section_name} />
        ) : (
          <TableInfo type={table.section_name} price={table.price} />
        )}
      </AccordionTrigger>
      <AccordionContent className="px-6 py-2">
        <TablesCounter table={table} />
      </AccordionContent>
    </AccordionItem>
  ));

  return (
    <div className="mt-10">
      <EventCard event={event} clickable={false} showLikeButton={false} />
      <Accordion
        className="mt-10 mb-4 dark:bg-foreground border-[1px] border-foreground dark:border-none rounded-md"
        type="single"
        defaultValue="item-0"
        collapsible
      >
        {tableOptions}
      </Accordion>
      <div className="dark:bg-foreground rounded-md p-6 dark:text-background border-[1px] border-foreground dark:border-none">
        <h5 className="text-md font-semibold mb-2">
          Vendor Check-In Information:
        </h5>
        <div className="space-y-1">
          <LabeledText label="Location">
            {generalVendorInfo?.check_in_location || "N/A"}
          </LabeledText>
          <LabeledText label="Check In Time">
            {generalVendorInfo?.check_in_time
              ? convertToStandardTime(generalVendorInfo?.check_in_time)
              : "N/A"}
          </LabeledText>
          <LabeledText label="Wifi Availability">
            {generalVendorInfo?.wifi_availability ? "Yes" : "No"}
          </LabeledText>
          <LabeledText label="Additional Information">
            {generalVendorInfo?.additional_information || "None"}
          </LabeledText>
        </div>
      </div>
    </div>
  );
}
