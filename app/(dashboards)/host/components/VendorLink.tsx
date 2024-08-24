import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventVendorData } from "../types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const VendorLink = ({
  vendorData,
  status,
}: {
  vendorData: EventVendorData;
  status: "PENDING" | "ACCEPTED";
}) => {
  const { event, profile } = vendorData;
  return (
    <Link
      className="w-full rounded-sm p-2 flex space-x-4 items-center hover:bg-secondary/40"
      href={`/host/events/${event.cleaned_name}/vendors?user=${profile.username}`}
    >
      <div className="relative">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profile.publicAvatarUrl} alt="avatar" />
          <AvatarFallback />
        </Avatar>
        <div
          className={cn(
            "absolute bottom-0 right-0 w-2 h-2 rounded-full",
            status === "PENDING" ? "bg-tertiary" : "bg-primary"
          )}
        />
      </div>
      <div>
        <p className="text-sm">
          {profile.firstName} {profile.lastName}
        </p>
        <p className="text-muted-foreground text-xs">{event.name}</p>
      </div>
    </Link>
  );
};
