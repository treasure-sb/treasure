"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { EventVendorData } from "../../../types";
import { Check } from "lucide-react";
import { X } from "lucide-react";

export type Vendor = {
  username: string;
  avatar_url: string | null;
  name: string;
  section: string;
  payment_status: Tables<"event_vendors">["payment_status"];
  application_status: Tables<"event_vendors">["application_status"];
  vendor_info: EventVendorData;
  tags: string[];
};

type VendorStatusColorMap = {
  [key: string]: string;
};

const VendorStatusColorMap: VendorStatusColorMap = {
  ACCEPTED: "bg-primary",
  PENDING: "bg-tertiary",
  REJECTED: "bg-destructive",
  WAITLISTED: "bg-orange-500",
};

const AvatarCell = ({ row }: CellContext<Vendor, any>) => {
  const avatar = row.getValue("avatar_url") as string;
  const name = row.getValue("name") as string;
  return (
    <Avatar className="m-auto">
      <AvatarImage src={avatar} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  );
};

const PaymentStatusCell = ({ cell }: CellContext<Vendor, any>) => {
  const value = cell.getValue() as string;
  const PaidCheck = <Check className="h-6 w-6 text-primary ml-7" />;
  const UnpaidX = <X className="h-6 w-6 text-red-500 ml-7" />;
  return value === "PAID" ? PaidCheck : UnpaidX;
};

const ApplicationStatusCell = ({ cell }: CellContext<Vendor, any>) => {
  const value = cell.getValue() as string;
  const color = VendorStatusColorMap[value];
  return (
    <div className="flex items-center space-x-2 w-fit">
      <span className={`rounded-full w-2 h-2 ${color}`} />
      <p className="w-fit">{`${value[0]}${value
        .slice(1)
        .toLocaleLowerCase()}`}</p>
    </div>
  );
};

const TagsCell = ({ cell }: CellContext<Vendor, any>) => {
  const value = cell.getValue() as string[];
  const tagsJoined = value.join(", ");

  return (
    <div className="h-10 w-40 flex items-center">
      <p className="truncate">{tagsJoined}</p>
    </div>
  );
};

const PaidHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Paid
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "avatar_url",
    header: "",
    cell: AvatarCell,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: TagsCell,
    filterFn: (row, id, value: string[]) => {
      const rowTags = row.getValue(id) as string[];
      return value.every((item) => rowTags.includes(item)) || value.length == 0;
    },
  },
  {
    accessorKey: "payment_status",
    header: PaidHeader,
    cell: PaymentStatusCell,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "application_status",
    header: "Application Status",
    cell: ApplicationStatusCell,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "vendor_info",
    header: undefined,
    cell: undefined,
  },
];
