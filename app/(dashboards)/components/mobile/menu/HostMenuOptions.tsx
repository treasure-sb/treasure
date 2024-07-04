import { Button } from "@/components/ui/button";
import { Settings, Calendar, LayoutDashboardIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function HostMenuOptions({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full" href="/host">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.endsWith("host") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <LayoutDashboardIcon className="stroke-1" size={28} />{" "}
          <p>Dashboard</p>
        </Button>
      </Link>
      <Link className="w-full" href="/host/events">
        <Button
          onClick={() => setIsOpen(false)}
          variant={pathname.includes("events") ? "secondary" : "ghost"}
          className="w-full rounded-sm text-lg justify-start space-x-2 p-6 font-normal"
        >
          <Calendar className="stroke-1" size={28} /> <p>My Events</p>
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
