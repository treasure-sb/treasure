import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlignLeftIcon,
  Settings,
  LogOut,
  Table,
  BadgeDollarSignIcon,
} from "lucide-react";
import { LayoutDashboardIcon } from "lucide-react";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";

export default function MobileNavBar() {
  return (
    <Sheet>
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
            <Button
              variant={"ghost"}
              className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
            >
              <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
              <p>Dashboard</p>
            </Button>
            <Button
              variant={"ghost"}
              className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
            >
              <BadgeDollarSignIcon className="stroke-1" /> <p>Sales</p>
            </Button>
            <Button
              variant={"ghost"}
              className="rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
            >
              <Table className="stroke-1" /> <p>My Tables</p>
            </Button>
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
      </SheetContent>
    </Sheet>
  );
}
