import VendorMobileSidebar from "./VendorMobileSidebar";
import HostMobileSidebar from "./HostMobileSidebar";
import HeaderAvatar from "../HeaderAvatar";
import { usePathname } from "next/navigation";

export default function MobileHeader() {
  const pathname = usePathname();
  const isVendor = pathname.startsWith("/vendor");
  const MobileSidebar = isVendor ? VendorMobileSidebar : HostMobileSidebar;

  return (
    <div className="flex justify-between items-center md:hidden sticky p-4 top-0 bg-background z-50">
      <MobileSidebar />
      <HeaderAvatar />
    </div>
  );
}
