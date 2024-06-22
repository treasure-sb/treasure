import { Button } from "@/components/ui/button";
import {
  Settings,
  Calendar,
  LayoutDashboardIcon,
  Coins,
  Heart,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminMenuOptions({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full" href="/admin">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.endsWith("admin") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
          <p>Dashboard</p>
        </Button>
      </Link>
      <Link className="w-full" href="/admin/invoices">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.includes("invoices") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Coins className="stroke-1" size={28} /> <p>Invoices</p>
        </Button>
      </Link>
      <Link className="w-full" href="/admin/likes">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.includes("likes") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Heart className="stroke-1" size={28} /> <p>Likes</p>
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
    </>
  );
}
