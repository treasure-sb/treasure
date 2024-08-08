import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventDisplayData, EventWithDates } from "@/types/event";
import { eventDisplayData } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type EventVendorQueryData = {
  application_status: string;
  profile: {
    avatar_url: string;
    first_name: string;
    last_name: string;
    business_name: string;
  };
  event: EventWithDates & {
    roles: {
      user_id: string;
      role: string;
      status: string;
    }[];
  };
};

type EventVendorData = {
  applicationStatus: string;
  profile: {
    firstName: string;
    lastName: string;
    businessName: string;
    publicAvatarUrl: string;
  };
  event: EventWithDates;
};

const transformEventVendorData = async (
  vendor: EventVendorQueryData
): Promise<EventVendorData> => {
  const supabase = await createSupabaseServerClient();
  const { event, profile, application_status } = vendor;
  const { roles, ...restEvent } = event;

  const {
    data: { publicUrl },
  } = await supabase.storage
    .from("avatars")
    .getPublicUrl(vendor.profile.avatar_url, {
      transform: {
        width: 200,
        height: 200,
      },
    });

  return {
    applicationStatus: application_status,
    profile: {
      firstName: profile.first_name,
      lastName: profile.last_name,
      businessName: profile.business_name,
      publicAvatarUrl: publicUrl,
    },
    event: restEvent,
  };
};

const VendorLink = ({ vendorData }: { vendorData: EventVendorData }) => {
  const { event, profile } = vendorData;
  return (
    <Link
      className="w-full rounded-sm p-2 flex space-x-4 items-center hover:bg-secondary/40"
      href={`/host/events/${event.cleaned_name}/vendors`}
    >
      <div className="relative">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profile.publicAvatarUrl} alt="avatar" />
          <AvatarFallback />
        </Avatar>
        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-tertiary" />
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

export default async function PendingVendors({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("event_vendors")
    .select(
      `application_status, 
       profile:profiles(avatar_url, first_name, last_name, business_name), 
       event:events!inner(*, dates:event_dates(date, start_time, end_time), roles:event_roles!inner(user_id, role, status))`
    )
    .eq("application_status", "PENDING")
    .eq("event.roles.user_id", user.id)
    .in("event.roles.role", ["HOST", "COHOST", "STAFF"])
    .eq("event.roles.status", "ACTIVE")
    .returns<EventVendorQueryData[]>()
    .limit(6);

  const pendingVendorData: EventVendorQueryData[] = data || [];
  const pendingVendorEventData = await Promise.all(
    pendingVendorData.map(transformEventVendorData)
  );

  return (
    <Card className="w-full md:w-1/4 h-[31rem]">
      <CardHeader>
        <CardTitle className="text-xl">
          <p>Pending Vendors</p>
        </CardTitle>
        <CardDescription>{}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[300px] flex flex-col items-center">
        {pendingVendorEventData.map((vendor, index) => (
          <>
            <VendorLink key={index} vendorData={vendor} />
            {index < pendingVendorEventData.length - 1 && <Separator />}
          </>
        ))}
      </CardContent>
    </Card>
  );
}
