"use client";

import { usePathname } from "next/navigation";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";

  return <div className={isHomePage ? "light-home" : ""}>{children}</div>;
}
