import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";
import HostSidebarOptions from "./HostSidebarOptions";
import VendorSidebarOptions from "./VendorSidebarOptions";

export const ActiveTab = ({ showSidebar }: { showSidebar: boolean }) => (
  <div
    className={`absolute w-[2px] h-full bg-primary top-0 ${
      showSidebar ? "right-[-42px]" : "right-[-10px]"
    }`}
  />
);

export default function Sidebar({ type }: { type: "host" | "vendor" }) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <motion.div
      layout
      transition={{ duration: 0.55, type: "spring" }}
      className={cn(
        "dashboard-section-theme md:flex flex-col justify-between hidden border-r-2 border-secondary",
        showSidebar ? "min-w-[20rem] max-w-[20rem] px-8 p-10" : "px-2 py-10"
      )}
    >
      <div>
        <Link
          href="/"
          className="font-semibold text-3xl flex items-center justify-center mb-8"
        >
          <TreasureEmerald width={28} height={28} />
          {showSidebar && <h1>Treasure</h1>}
        </Link>
        <div className="space-y-6 flex flex-col">
          {type === "host" ? (
            <HostSidebarOptions showSidebar={showSidebar} />
          ) : type === "vendor" ? (
            <VendorSidebarOptions showSidebar={showSidebar} />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col space-y-6">
        {showSidebar ? (
          <Button
            onClick={() => setShowSidebar(false)}
            variant={"ghost"}
            className={cn(
              "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
              showSidebar ? "justify-start" : "justify-center"
            )}
          >
            <EyeOff className="stroke-1" size={28} />
            <p>Hide Sidebar</p>
          </Button>
        ) : (
          <Button
            onClick={() => setShowSidebar(true)}
            variant={"ghost"}
            className={cn(
              "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
              showSidebar ? "justify-start" : "justify-center"
            )}
          >
            <Eye className="stroke-1" size={28} />
          </Button>
        )}
        <Button
          variant={"ghost"}
          className={cn(
            "rounded-sm w-full text-lg justify-center space-x-2 p-6 font-normal",
            showSidebar ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className="stroke-1" size={28} />
          {showSidebar && <p>Log out</p>}
        </Button>
      </div>
    </motion.div>
  );
}
