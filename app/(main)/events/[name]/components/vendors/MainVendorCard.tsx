import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Vendor, VendorTypes } from "./Vendors";
import { getTagIcon } from "@/lib/helpers/TagIcons";

export default function MainVendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={
        vendor.type === VendorTypes.PROFILE
          ? `/${vendor.username}`
          : `/${vendor.username}?type=t`
      }
      className="h-36 col-span-2 md:col-span-1 flex space-x-4 items-center border-[1px] rounded-2xl w-full p-4 py-2 relative group bg-background"
    >
      <Avatar className="h-24 md:h-28 w-24 md:w-28">
        <AvatarImage src={vendor.publicUrl} />
        <AvatarFallback />
      </Avatar>
      <div className="flex flex-col space-y-2">
        <div>
          <p className="font-semibold text-lg md:text-xl line-clamp-2">
            {vendor.businessName
              ? vendor.businessName
              : vendor.firstName + " " + vendor.lastName}
          </p>
          <p className="text-xxs text-gray-500">@{vendor.username}</p>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {vendor.bio}
          </p>
        </div>
        <div className="flex space-x-2">
          {vendor.tags.map((tag) => (
            <div key={tag}>{getTagIcon(tag)}</div>
          ))}
        </div>
      </div>
    </Link>
  );
}
