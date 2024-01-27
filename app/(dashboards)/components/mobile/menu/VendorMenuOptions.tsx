import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Table, BadgeDollarSignIcon } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function VendorMenuOptions({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full" href="/vendor">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.split("/").length === 2 ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <LayoutDashboardIcon className="stroke-1" size={28} />
          <p>Dashboard</p>
        </Button>
      </Link>
      <Link className="w-full" href="/vendor/sales">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.includes("sales") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <BadgeDollarSignIcon className="stroke-1" size={28} /> <p>Sales</p>
        </Button>
      </Link>
      <Link className="w-full" href="/vendor/tables">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.includes("tables") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Table className="stroke-1" /> <p>My Tables</p>
        </Button>
      </Link>
      <Link className="w-full" href="/profile">
        <Button
          variant={"ghost"}
          className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal w-full"
        >
          <Settings className="stroke-1" size={28} /> <p>Settings</p>
        </Button>
      </Link>
    </>
  );
}
