import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlignLeftIcon, Settings, LogOut, Calendar } from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import { useStore } from "../../vendor/store";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";

export default function HostMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentPage } = useStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <AlignLeftIcon className="stroke-1" size={38} />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader className="mt-6">
          <SheetTitle>
            <Link
              href="/"
              className="font-semibold text-3xl space-x-1 flex items-center justify-center mr-6"
            >
              <TreasureEmerald width={28} height={28} />
              <h1>Treasure</h1>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between h-[80%] mx-4 mt-10">
          <div className="flex flex-col space-y-4">
            {/* <Link className="w-full" href="/host">
              <Button
                onClick={() => setIsOpen(false)}
                variant={currentPage === "dashboard" ? "secondary" : "ghost"}
                className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
              >
                <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
                <p>Dashboard</p>
              </Button>
            </Link> */}
            <Link className="w-full" href="/host/events">
              <Button
                onClick={() => setIsOpen(false)}
                variant={currentPage === "events" ? "secondary" : "ghost"}
                className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
              >
                <Calendar className="stroke-1" size={28} /> <p>Events</p>
              </Button>
            </Link>
            <Link className="w-full" href="/profile">
              <Button
                variant={"ghost"}
                className="rounded-sm w-full text-lg justify-start space-x-2 p-6 font-normal"
              >
                <Settings className="stroke-1" size={28} /> <p>Settings</p>
              </Button>
            </Link>
          </div>
          <Button
            variant={"ghost"}
            className="rounded-sm text-lg font-normal justify-start space-x-2 p-6"
          >
            <LogOut className="stroke-1" size={28} /> <p>Log out</p>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
