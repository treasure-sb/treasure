"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CustomerData } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TicketIcon } from "lucide-react";

export type Attendee = {
  id: string;
  quantity: number;
  ticketsScanned: number;
  ticketNames: string[];
  customer: CustomerData;
  lastPurchaseDate: Date;
};

const CustomerCell = ({ row }: CellContext<Attendee, any>) => {
  const customer = row.getValue("customer") as CustomerData;
  const customerName = `${customer.first_name} ${customer.last_name}`;

  return (
    <div className="flex space-x-4 items-center">
      <Avatar>
        <AvatarImage src={customer.avatar_url} />
        <AvatarFallback />
      </Avatar>
      <div>
        <p>{customerName}</p>
        <p className="text-muted-foreground">
          {customer.email || customer.phone}
        </p>
      </div>
    </div>
  );
};

const QuantityCell = ({ cell }: CellContext<Attendee, any>) => {
  const quantity = cell.getValue() as number;
  return <p className="text-muted-foreground">{quantity}</p>;
};

const TicketsScannedCell = ({ cell }: CellContext<Attendee, any>) => {
  const ticketsScanned = cell.getValue() as number;
  return <p className="text-muted-foreground">{ticketsScanned}</p>;
};

const DateCell = ({ cell }: CellContext<Attendee, any>) => {
  const date = cell.getValue() as Date;

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return (
    <p className="text-muted-foreground">{`${formattedDate}, ${formattedTime}`}</p>
  );
};

const TicketCell = ({ cell }: CellContext<Attendee, any>) => {
  const ticketNames = cell.getValue() as string[];
  return (
    <div className="flex items-center space-x-2 h-10 w-60">
      <TicketIcon size={24} className="stroke-1 text-tertiary flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[.825rem] truncate">{ticketNames.join(", ")}</p>
      </div>
    </div>
  );
};

const QuantityHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Total Tickets
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const DateHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Lastest Purchase Date
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Attendee>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: CustomerCell,
  },
  {
    accessorKey: "ticketNames",
    header: "Tickets",
    cell: TicketCell,
  },
  {
    accessorKey: "quantity",
    header: QuantityHeader,
    cell: QuantityCell,
  },
  {
    accessorKey: "ticketsScanned",
    header: "Tickets Scanned",
    cell: TicketsScannedCell,
  },
  {
    accessorKey: "lastPurchaseDate",
    header: DateHeader,
    cell: DateCell,
  },
];
