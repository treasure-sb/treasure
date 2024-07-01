"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotifyVendor from "./NotifyVendor";

export type Vendor = {
  vendor_id: string;
  avatar_url: string | null;
  name: string;
  section: string;
  type: string;
  assignment: number;
  notified: boolean;
  notificationPayload: {
    eventName: string;
    eventId: string;
    phone: string;
  } | null;
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

const TypeHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Type
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

const AssignmentHeader = ({ column }: { column: any }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Table #
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
    accessorKey: "type",
    header: TypeHeader,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "assignment",
    header: AssignmentHeader,
    filterFn: (row, id, value) => {
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "notified",
    header: "Notified",
    cell: ({ row }) => {
      return row.getValue("notified") ? "Yes" : "No";
    },
  },
  {
    id: "notify",
    header: "Notify",
    cell: ({ row }) => {
      const vendor = row.original;
      return vendor.type === "Verified" && !vendor.notified ? (
        <NotifyVendor vendor={vendor} />
      ) : null;
    },
  },
];
