import { Button } from "@/components/ui/button";
import { Settings, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ActiveTab } from "./Sidebar";
import Link from "next/link";

export default function HostSidebarOptions({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <Link className="w-full relative" href="/host/events">
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <Calendar className="stroke-1" size={28} />
          {showSidebar && <p>My Events</p>}
        </Button>
        {pathname.includes("events") && <ActiveTab showSidebar={showSidebar} />}
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
