"use client";

import MobileHeader from "./components/mobile/MobileHeader";
import Sidebar from "./components/desktop/sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isVendor = pathname.startsWith("/vendor");

  return (
    <>
      <MobileHeader />
      <div className="p-4 md:p-0 md:flex md:min-h-screen relative">
        <Sidebar type={isVendor ? "vendor" : "host"} />
        <div className="mt-6 md:mt-4 md:px-8 md:py-4 max-h-[calc(100vh-1rem)] md:overflow-scroll scrollbar-hidden flex-grow">
          {children}
        </div>
      </div>
    </>
  );
}
