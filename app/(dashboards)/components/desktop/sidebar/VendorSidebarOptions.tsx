import { Button } from "@/components/ui/button";
import { Settings, Table, BadgeDollarSignIcon } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { ActiveTab } from "./Sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function VendorSidebarOptions({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full relative" href="/vendor">
        <Button
          variant={"ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <LayoutDashboardIcon className="stroke-1" size={28} />
          {showSidebar && <p>Dashboard</p>}
        </Button>
        {pathname.split("/").length === 2 && (
          <ActiveTab showSidebar={showSidebar} />
        )}
      </Link>
      <Link className="w-full relative" href="/vendor/sales">
        <Button
          variant={"ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <BadgeDollarSignIcon className="stroke-1" size={28} />
          {showSidebar && <p>Sales</p>}
        </Button>
        {pathname.includes("sales") && <ActiveTab showSidebar={showSidebar} />}
      </Link>
      <Link className="w-full relative" href="/vendor/tables">
        <Button
          variant={"ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Table className="stroke-1" /> {showSidebar && <p>My Tables</p>}
        </Button>
        {pathname.includes("tables") && <ActiveTab showSidebar={showSidebar} />}
      </Link>
      <Link className="w-full" href="/profile">
        <Button
          variant={"ghost"}
          className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Settings className="stroke-1" size={28} />
          {showSidebar && <p>Settings</p>}
        </Button>
      </Link>
    </>
  );
}
