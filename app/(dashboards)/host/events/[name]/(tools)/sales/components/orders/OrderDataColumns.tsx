"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { CustomerData } from "../../types";
import { ArrowUpDown, TicketIcon } from "lucide-react";
import TableIcon from "@/components/icons/TableIcon";
import { Button } from "@/components/ui/button";

export type Order = {
  orderID: number;
  quantity: number;
  amountPaid: number;
  purchaseDate: Date;
  type: "TABLE" | "TICKET";
  itemName: string;
  customer: CustomerData;
};

const CustomerCell = ({ row }: CellContext<Order, any>) => {
  const customer = row.getValue("customer") as CustomerData;
  const customerName = `${customer.first_name} ${customer.last_name}`;

  return (
    <div className="flex space-x-4 items-center">
      <Avatar>
        <AvatarImage src={customer.publicAvatarUrl} />
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

const TypeCell = ({ row }: CellContext<Order, any>) => {
  const type = row.getValue("type") as Order["type"];
  const itemName = row.getValue("itemName") as string;
  const typeText = type === "TABLE" ? "Table" : "Ticket";

  return (
    <div className="flex items-center space-x-4">
      {type === "TICKET" ? (
        <TicketIcon className="stroke-1 text-tertiary" />
      ) : (
        <TableIcon />
      )}
      <div>
        <p>{typeText}</p>
        <p className="text-muted-foreground">{itemName}</p>
      </div>
    </div>
  );
};

const QuantityCell = ({ cell }: CellContext<Order, any>) => {
  const quantity = cell.getValue() as number;
  return <p className="text-muted-foreground">{quantity}</p>;
};

const DateCell = ({ cell }: CellContext<Order, any>) => {
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

const OrderIDCell = ({ cell }: CellContext<Order, any>) => {
  const orderID = cell.getValue() as number;
  return <p>#{orderID}</p>;
};

const AmountPaidCell = ({ cell }: CellContext<Order, any>) => {
  const amountPaid = cell.getValue() as number;
  return <p className="text-muted-foreground">${amountPaid.toFixed(2)}</p>;
};

const AmountPaidHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Amount Paid
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const QuantityHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Quantity
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
      Purchase Date
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderID",
    header: "Order ID",
    cell: OrderIDCell,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: TypeCell,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "quantity",
    header: QuantityHeader,
    cell: QuantityCell,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: CustomerCell,
  },
  {
    accessorKey: "amountPaid",
    header: AmountPaidHeader,
    cell: AmountPaidCell,
  },
  {
    accessorKey: "purchaseDate",
    header: DateHeader,
    cell: DateCell,
  },
  {
    accessorKey: "itemName",
    header: undefined,
    cell: undefined,
  },
];
