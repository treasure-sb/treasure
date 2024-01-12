import { Button } from "@/components/ui/button";
import { Settings, LogOut, Table, BadgeDollarSignIcon } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { useStore } from "../store";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";

export default function Sidebar() {
  const { currentPage } = useStore();

  return (
    <div className="md:flex flex-col justify-between h-full hidden border-r-[.5px] border-secondary dashboard-spacing">
      <div className="flex flex-col space-y-6">
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center justify-center "
        >
          <TreasureEmerald width={28} height={28} />
          <h1>Treasure</h1>
        </Link>
        <Link className="w-full" href="/vendor">
          <Button
            variant={currentPage === "dashboard" ? "secondary" : "ghost"}
            className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
          >
            <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
            <p>Dashboard</p>
          </Button>
        </Link>
        <Link className="w-full" href="/vendor/sales">
          <Button
            variant={currentPage === "sales" ? "secondary" : "ghost"}
            className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
          >
            <BadgeDollarSignIcon className="stroke-1" size={28} /> <p>Sales</p>
          </Button>
        </Link>
        <Link className="w-full" href="/vendor/tables">
          <Button
            variant={currentPage === "tables" ? "secondary" : "ghost"}
            className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
          >
            <Table className="stroke-1" /> <p>My Tables</p>
          </Button>
        </Link>
        <Button
          variant={"ghost"}
          className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Settings className="stroke-1" size={28} /> <p>Settings</p>
        </Button>
      </div>
      <Button
        variant={"ghost"}
        className="rounded-sm text-lg font-normal justify-start space-x-2 p-6"
      >
        <LogOut className="stroke-1" size={28} /> <p>Log out</p>
      </Button>
    </div>
  );
}
