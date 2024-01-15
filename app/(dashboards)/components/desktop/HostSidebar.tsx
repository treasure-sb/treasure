import { Button } from "@/components/ui/button";
import { Settings, LogOut, Calendar } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { useStore } from "../../host/store";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";

export default function HostSidebar() {
  const { currentPage } = useStore();

  return (
    <div className="dashboard-section-theme md:flex flex-col justify-between h-full hidden border-r-2 border-secondary dashboard-spacing">
      <div>
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center justify-center mb-8"
        >
          <TreasureEmerald width={28} height={28} />
          <h1>Treasure</h1>
        </Link>
        <div className="space-y-6 flex flex-col">
          <Link className="w-full relative" href="/host">
            <Button
              variant={"ghost"}
              className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
            >
              <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
              <p>Dashboard</p>
            </Button>
            {currentPage === "dashboard" && (
              <div className="absolute w-[2px] h-full bg-primary right-[-34px] top-0" />
            )}
          </Link>
          <Link className="w-full relative" href="/host/events">
            <Button
              variant={"ghost"}
              className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
            >
              <Calendar className="stroke-1" size={28} /> <p>My Events</p>
            </Button>
            {currentPage === "events" && (
              <div className="absolute w-[2px] h-full bg-primary right-[-34px] top-0" />
            )}
          </Link>
          <Button
            variant={"ghost"}
            className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
          >
            <Settings className="stroke-1" size={28} /> <p>Settings</p>
          </Button>
        </div>
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
