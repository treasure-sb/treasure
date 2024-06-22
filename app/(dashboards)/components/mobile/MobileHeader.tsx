"use client";

import Menu from "./menu/Menu";
import HeaderAvatar from "../HeaderAvatar";
import HeaderMotion from "@/components/shared/header/HeaderMotion";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const type = pathname.startsWith("/vendor")
    ? "vendor"
    : pathname.startsWith("/host")
    ? "host"
    : "admin";

  return (
    <div className="z-50 block md:hidden relative">
      <HeaderMotion>
        <Menu type={type} />
        <HeaderAvatar />
      </HeaderMotion>
    </div>
  );
}
