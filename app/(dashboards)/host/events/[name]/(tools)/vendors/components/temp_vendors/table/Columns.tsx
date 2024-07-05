"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TempVendor = {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
};

export const columns: ColumnDef<TempVendor, any>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "avatar_url",
    header: "Avatar",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
