import { Button } from "@/components/ui/button";
import {
  Settings,
  Calendar,
  LayoutDashboardIcon,
  Coins,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ActiveTab } from "./Sidebar";
import Link from "next/link";

export default function AdminSidebarOptions({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full relative" href="/admin">
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <LayoutDashboardIcon className="stroke-1" size={28} />
          {showSidebar && <p>Dashboard</p>}
        </Button>
        {pathname.endsWith("admin") && <ActiveTab showSidebar={showSidebar} />}
      </Link>
      <Link className="w-full relative" href="/admin/invoices">
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <Coins className="stroke-1" size={28} />
          {showSidebar && <p>Invoices</p>}
        </Button>
        {pathname.includes("invoices") && (
          <ActiveTab showSidebar={showSidebar} />
        )}
      </Link>
      <Link className="w-full relative" href="/admin/likes">
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <Heart className="stroke-1" size={28} />
          {showSidebar && <p>Likes</p>}
        </Button>
        {pathname.includes("likes") && <ActiveTab showSidebar={showSidebar} />}
      </Link>
      <Link className="w-full" href="/profile">
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <Settings className="stroke-1" size={28} />
          {showSidebar && <p>Settings</p>}
        </Button>
      </Link>
    </>
  );
}
