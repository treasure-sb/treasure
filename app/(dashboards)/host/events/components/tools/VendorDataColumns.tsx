import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Tables } from "@/types/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Vendor = {
  avatar_url: string | null;
  name: string;
  business_name: string | null;
  email: string;
  payment_status: Tables<"event_vendors">["payment_status"];
  vendor_status: Tables<"event_vendors">["application_status"];
};

type VendorStatusColorMap = {
  [key: string]: string;
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
  return (
    <div className="flex items-center space-x-2">
      <span
        className={`rounded-full w-2 h-2 ${
          value === "PAID" ? "bg-primary" : "bg-destructive"
        }`}
      />
      <p>{value}</p>
    </div>
  );
};

const VendorStatusColorMap: VendorStatusColorMap = {
  ACCEPTED: "bg-primary",
  PENDING: "bg-tertiary",
  REJECTED: "bg-destructive",
};

const VendorStatusCell = ({ cell }: CellContext<Vendor, any>) => {
  const value = cell.getValue() as string;
  const color = VendorStatusColorMap[value];
  return (
    <div className="flex items-center space-x-2">
      <span className={`rounded-full w-2 h-2 ${color}`} />
      <p>{value}</p>
    </div>
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
    accessorKey: "business_name",
    header: "Business Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: PaymentStatusCell,
  },
  {
    accessorKey: "vendor_status",
    header: "Vendor Status",
    cell: VendorStatusCell,
  },
];
