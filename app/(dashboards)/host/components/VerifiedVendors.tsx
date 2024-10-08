import { User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import createSupabaseServerClient from "@/utils/supabase/server";
import { EventVendorQueryData } from "../types";
import { transformEventVendorData } from "./PendingVendors";
import { VendorLink } from "./VendorLink";

export default async function VerifiedVendors({ user }: { user: User }) {
  const today = new Date();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("event_vendors")
    .select(
      `application_status, 
       profile:profiles(avatar_url, username, first_name, last_name, business_name), 
       event:events!inner(*, dates:event_dates(date, start_time, end_time), event_roles!inner(*))`
    )
    .eq("application_status", "ACCEPTED")
    .eq("event.event_roles.user_id", user.id)
    .in("event.event_roles.role", ["HOST", "COHOST", "STAFF"])
    .eq("event.event_roles.status", "ACTIVE")
    .gte("event.max_date", today.toISOString())
    .returns<EventVendorQueryData[]>()
    .limit(6);

  const verifiedVendorData: EventVendorQueryData[] = data || [];
  const verifiedVendorEventData = await Promise.all(
    verifiedVendorData.map(transformEventVendorData)
  );

  return (
    <Card className="w-full col-span-1 md:col-span-1 2xl:col-span-1 h-[31rem]">
      <CardHeader>
        <CardTitle className="text-xl">
          <p>Verified Vendors</p>
        </CardTitle>
        <CardDescription>{}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 min-h-[300px] flex flex-col items-center">
        {verifiedVendorEventData.length === 0 ? (
          <p className="text-muted-foreground text-sm mt-40 text-center">
            You don't have any verified vendors.
          </p>
        ) : (
          verifiedVendorEventData.map((vendor, index) => (
            <>
              <VendorLink key={index} vendorData={vendor} status={"ACCEPTED"} />
              {index < verifiedVendorEventData.length - 1 && <Separator />}
            </>
          ))
        )}
      </CardContent>
    </Card>
  );
}
