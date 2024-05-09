import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";

export default function MainVendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={
        vendor.type === VendorTypes.PROFILE
          ? `/${vendor.username}`
          : `/${vendor.username}?type=t`
      }
      className="h-32 col-span-2 flex space-x-4 items-center border-[1px] rounded-2xl w-full md:w-fit p-4 py-2 pr-10 relative group bg-background group-hover:bg-slate-10 hover:bg-slate transition duration-300"
    >
      <Avatar className="h-24 md:h-28 w-24 md:w-28">
        <AvatarImage src={vendor.publicUrl} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col space-y-2">
        <div>
          <p className="font-semibold text-lg md:text-xl">
            {vendor.businessName
              ? vendor.businessName
              : vendor.firstName + " " + vendor.lastName}
          </p>
          <p className="text-xs text-gray-500 mb-1">@{vendor.username}</p>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {vendor.bio}
          </p>
        </div>
      </div>
    </Link>
  );
}
