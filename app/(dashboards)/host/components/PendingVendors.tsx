import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventVendorData, EventVendorQueryData } from "../types";
import createSupabaseServerClient from "@/utils/supabase/server";
import { VendorLink } from "./VendorLink";

export const transformEventVendorData = async (
  vendor: EventVendorQueryData
): Promise<EventVendorData> => {
  const supabase = await createSupabaseServerClient();
  const { event, profile, application_status } = vendor;

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
      username: profile.username,
      firstName: profile.first_name,
      lastName: profile.last_name,
      businessName: profile.business_name,
      publicAvatarUrl: publicUrl,
    },
    event,
  };
};

export default async function PendingVendors({ user }: { user: User }) {
  const supabase = await createSupabaseServerClient();
  const today = new Date();
  const { data } = await supabase
    .from("event_vendors")
    .select(
      `application_status, 
       profile:profiles(avatar_url, username, first_name, last_name, business_name), 
       event:events!inner(*, dates:event_dates(date, start_time, end_time), event_roles!inner(*))`
    )
    .eq("application_status", "PENDING")
    .eq("event.event_roles.user_id", user.id)
    .in("event.event_roles.role", ["HOST", "COHOST", "STAFF"])
    .eq("event.event_roles.status", "ACTIVE")
    .gte("event.max_date", today.toISOString())
    .returns<EventVendorQueryData[]>()
    .limit(6);

  const pendingVendorData: EventVendorQueryData[] = data || [];
  const pendingVendorEventData = await Promise.all(
    pendingVendorData.map(transformEventVendorData)
  );

  return (
    <Card className="w-full col-span-1 md:col-span-1 2xl:col-span-1 h-[31rem]">
      <CardHeader>
        <CardTitle className="text-xl">
          <p>Pending Vendors</p>
        </CardTitle>
        <CardDescription>{}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[300px] flex flex-col items-center">
        {pendingVendorEventData.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-40 text-center">
            You don't have any pending vendors.
          </p>
        ) : (
          pendingVendorEventData.map((vendor, index) => (
            <>
              <VendorLink key={index} vendorData={vendor} status={"PENDING"} />
              {index < pendingVendorEventData.length - 1 && <Separator />}
            </>
          ))
        )}
      </CardContent>
    </Card>
  );
}
