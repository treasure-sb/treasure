import { type Vendor } from "./Vendors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function VendorGroup({ vendors }: { vendors: Vendor[] }) {
  const vendorCount = vendors.length;
  const vendorsToShow = 6;
  const extraVendors = vendorCount - vendorsToShow;

  return (
    <div className="flex flex-wrap mt-2">
      {vendors.slice(0, vendorsToShow).map((vendor, i) => (
        <Avatar
          className={cn(
            "h-14 w-14 border-4 border-background",
            i !== 0 && "-ml-5"
          )}
        >
          <AvatarImage src={vendor.publicUrl} />
          <AvatarFallback />
        </Avatar>
      ))}
      {extraVendors > 0 && (
        <Avatar className="h-14 w-14 border-4 border-background -ml-5">
          <AvatarFallback>+{vendorCount - vendorsToShow}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
