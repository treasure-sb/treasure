"use client";

import Menu from "./menu/Menu";
import HeaderAvatar from "../HeaderAvatar";
import HeaderMotion from "@/components/header/HeaderMotion";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const isVendor = pathname.startsWith("/vendor");

  return (
    <div className="z-50 block md:hidden relative">
      <HeaderMotion>
        <Menu type={isVendor ? "vendor" : "host"} />
        <HeaderAvatar />
      </HeaderMotion>
    </div>
  );
}
