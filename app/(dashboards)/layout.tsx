"use client";

import VendorSidebar from "./components/desktop/VendorSidebar";
import HostSidebar from "./components/desktop/HostSidebar";
import MobileHeader from "./components/mobile/MobileHeader";
import DesktopHeader from "./components/desktop/DesktopHeader";
import { usePathname } from "next/navigation";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isVendor = pathname.startsWith("/vendor");
  const Sidebar = isVendor ? VendorSidebar : HostSidebar;

  return (
    <>
      <MobileHeader />
      <div className="p-4 md:p-0 md:grid md:grid-cols-[360px_minmax(200px,1fr)] md:min-h-screen relative">
        <Sidebar />
        <main className="mt-6 md:mt-4 md:px-8 md:py-4 max-h-[calc(100vh-1rem)] md:overflow-scroll scrollbar-hidden">
          <DesktopHeader />
          {children}
        </main>
      </div>
    </>
  );
}
