"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { PromoType, Status } from "../../../types";

type Discount = {
  amount: number;
  type: PromoType;
};

export type PromoCode = {
  id: string;
  code: string;
  discount: Discount;
  status: Status;
  num_used: number;
  usage_limit: number | null;
  created_at: Date;
};

const StatusCell = ({ cell }: CellContext<PromoCode, any>) => {
  const status = cell.getValue() as Status;

  return (
    <div
      className={cn(
        "text-xs rounded-[3px] font-semibold p-1 w-fit",
        status === "ACTIVE"
          ? "bg-primary/10 text-green-600"
          : "bg-destructive/10 text-red-600"
      )}
    >
      <span>{status === "ACTIVE" ? "Active" : "Inactive"}</span>
    </div>
  );
};

const DiscountCell = ({ row }: CellContext<PromoCode, any>) => {
  const discount = row.getValue("discount") as Discount;
  const amount = discount.amount;
  const type = discount.type;

  return (
    <div>
      {type === "DOLLAR" && "$"}
      <span>{amount}</span>
      {type === "PERCENT" && "%"}
      <span className="ml-1">OFF</span>
    </div>
  );
};

const DateCell = ({ cell }: CellContext<PromoCode, any>) => {
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

const codeCell = ({ cell }: CellContext<PromoCode, any>) => {
  const code = cell.getValue() as string;

  return <span className="font-bold">{code}</span>;
};

const usesCell = ({ row }: CellContext<PromoCode, any>) => {
  const numUsed = row.getValue("num_used") as number;
  const usageLimit = row.original.usage_limit;

  return (
    <div>
      <span>{numUsed}</span>
      <span className="text-muted-foreground">
        /{usageLimit || <span>∞</span>}
      </span>
    </div>
  );
};

const DateHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Created At
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const UsesHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="font-normal -ml-4"
    >
      Uses
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const promoColumns: ColumnDef<PromoCode, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: codeCell,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: DiscountCell,
    filterFn: (row, id, value) => {
      const discount = row.getValue(id) as Discount;
      return discount.type === value;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "num_used",
    header: UsesHeader,
    cell: usesCell,
  },
  {
    accessorKey: "created_at",
    header: DateHeader,
    cell: DateCell,
  },
];
