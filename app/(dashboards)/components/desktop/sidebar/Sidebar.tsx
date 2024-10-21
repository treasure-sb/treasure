"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { EyeOff, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { logoutUser } from "@/lib/actions/auth";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "@/components/shared/ThemeSwitch";
import TreasureEmerald from "@/components/icons/TreasureEmerald";
import Link from "next/link";
import HostSidebarOptions from "./HostSidebarOptions";
import VendorSidebarOptions from "./VendorSidebarOptions";
import AdminSidebarOptions from "./AdminSidebarOptions";

export const ActiveTab = ({ showSidebar }: { showSidebar: boolean }) => (
  <div
    className={`absolute w-[2px] h-full bg-primary top-0 ${
      showSidebar ? "right-[-42px]" : "right-[-10px]"
    }`}
  />
);

export default function Sidebar() {
  const pathname = usePathname();
  const type = pathname.startsWith("/vendor")
    ? "vendor"
    : pathname.startsWith("/host")
    ? "host"
    : "admin";

  const [showSidebar, setShowSidebar] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const showSidebar = localStorage.getItem("showSidebar");
    if (showSidebar) {
      setShowSidebar(JSON.parse(showSidebar));
    }
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    queryClient.clear();
  };

  const handleShowSidebar = (showSidebar: boolean) => {
    setShowSidebar(showSidebar);
    localStorage.setItem("showSidebar", JSON.stringify(showSidebar));
  };

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
          href="/home"
          className="flex items-center justify-center mb-8 -space-x-1 font-bold"
        >
          {showSidebar ? (
            <>
              <TreasureEmerald width={22} height={22} />
              <p className="text-3xl tracking-[-0.1rem] lg:tracking-[-0.14rem]">
                Treasure
              </p>
            </>
          ) : (
            <TreasureEmerald width={28} height={28} />
          )}
        </Link>
        <div className="space-y-6 flex flex-col">
          {type === "host" ? (
            <HostSidebarOptions showSidebar={showSidebar} />
          ) : type === "vendor" ? (
            <VendorSidebarOptions showSidebar={showSidebar} />
          ) : (
            <AdminSidebarOptions showSidebar={showSidebar} />
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-6">
        {showSidebar && (
          <div className="px-0">
            <ThemeSwitch />
          </div>
        )}
        {showSidebar ? (
          <Button
            onClick={() => handleShowSidebar(false)}
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
            onClick={() => handleShowSidebar(true)}
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
          onClick={async () => await handleLogout()}
        >
          <LogOut className="stroke-1" size={28} />
          {showSidebar && <p>Log out</p>}
        </Button>
      </div>
    </motion.div>
  );
}
