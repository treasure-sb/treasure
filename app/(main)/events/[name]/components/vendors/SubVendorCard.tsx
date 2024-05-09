import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";

export default function SubVendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={
        vendor.type === VendorTypes.PROFILE
          ? `/${vendor.username}`
          : `/${vendor.username}?type=t`
      }
      className="w-full flex space-x-4 items-center border-[1px] rounded-2xl w-= md:w-fit p-4 py-2 relative group bg-background group-hover:bg-slate-10 hover:bg-slate transition duration-300"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={vendor.publicUrl} />
        <AvatarFallback />
      </Avatar>
    </Link>
  );
}
