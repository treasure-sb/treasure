"use client";

import Menu from "./menu/Menu";
import HeaderAvatar from "../HeaderAvatar";
import HeaderMotion from "@/components/header/HeaderMotion";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const isVendor = pathname.startsWith("/vendor");

  return (
    // <div className="flex justify-between items-center md:hidden sticky p-4 top-0 bg-background z-50">
    //   <Menu type={isVendor ? "vendor" : "host"} />
    //   <HeaderAvatar />
    // </div>
    <div className="z-50 block md:hidden relative">
      <HeaderMotion>
        <Menu type={isVendor ? "vendor" : "host"} />
        <HeaderAvatar />
      </HeaderMotion>
    </div>
  );
}
