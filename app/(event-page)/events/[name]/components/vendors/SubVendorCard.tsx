import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";
import { getTagIcon } from "@/lib/helpers/TagIcons";

export default function SubVendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={
        vendor.type === VendorTypes.PROFILE
          ? `/${vendor.username}`
          : `/${vendor.username}?type=t`
      }
      className="w-full flex space-x-4 items-center border-[1px] rounded-2xl md:w-fit p-2 relative group bg-background"
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={vendor.publicUrl} />
        <AvatarFallback />
      </Avatar>
      <div className="overflow-hidden">
        <p className="truncate text-xxs text-gray-500">@{vendor.username}</p>
        <div className="flex space-x-1">
          {vendor.tags.map((tag) => (
            <div key={tag}>{getTagIcon(tag)}</div>
          ))}
        </div>
      </div>
    </Link>
  );
}
