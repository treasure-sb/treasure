"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CellContext, ColumnDef } from "@tanstack/react-table";

export type TempVendor = {
  id: string;
  business_name: string;
  avatar_url: string;
  tag: string;
  instagram: string | null;
  email: string | null;
};

const AvatarCell = ({ row }: CellContext<TempVendor, any>) => {
  const avatar = row.getValue("avatar_url") as string;

  return (
    <Avatar className="m-auto">
      <AvatarImage src={avatar} />
      <AvatarFallback />
    </Avatar>
  );
};

export const columns: ColumnDef<TempVendor, any>[] = [
  {
    accessorKey: "avatar_url",
    header: "",
    cell: AvatarCell,
  },
  {
    accessorKey: "business_name",
    header: "Business Name",
  },
  {
    accessorKey: "tag",
    header: "Tag",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "instagram",
    header: "Instagram",
  },
];
