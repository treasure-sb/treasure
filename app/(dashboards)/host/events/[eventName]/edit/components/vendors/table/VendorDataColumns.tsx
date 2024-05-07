"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Vendor = {
  avatar_url: string | null;
  name: string;
  section: string;
  type: string;
  assignment: number;
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
];
