import { useUser } from "../query";
import { eventDisplayData } from "@/lib/helpers/events";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./store";
import { Tables } from "@/types/supabase";
import { getProfileAvatar } from "@/lib/helpers/profiles";
import { Vendor } from "./events/components/tools/VendorDataColumns";

export const useHostedEvents = () => {
  const user = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["events-hosting", user],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id);

      if (!data) return [];
      const eventData = eventDisplayData(data);
      return eventData;
    },
    enabled: !!user,
  });
  return { data, isLoading };
};

type EventVendorProfiles = Tables<"event_vendors"> & {
  vendor: Tables<"profiles">;
};

export const useEventVendors = () => {
  const { event } = useStore();
  const { data } = useQuery({
    queryKey: ["event_vendors", event?.id],
    queryFn: async () => {
      if (!event) return [];
      const supabase = createClient();
      const { data } = await supabase
        .from("event_vendors")
        .select("*, vendor:profiles(*)")
        .eq("event_id", event.id);

      if (!data) return [];
      const eventVendorProfles = data as EventVendorProfiles[];
      return eventVendorProfles;
    },
    enabled: !!event,
  });
  return data;
};

export const useEventVendorsTableData = () => {
  const eventVendors = useEventVendors();
  const { data } = useQuery({
    queryKey: ["event_vendors_table_data", eventVendors],
    queryFn: async () => {
      if (!eventVendors) return [];
      const tableDataPromise = eventVendors.map(async (eventVendor) => {
        const avatar = await getProfileAvatar(eventVendor.vendor.avatar_url);
        return {
          avatar_url: avatar,
          name: `${eventVendor.vendor.first_name} ${eventVendor.vendor.last_name}`,
          business_name: eventVendor.vendor.business_name,
          email: eventVendor.vendor.email,
          payment_status: eventVendor.payment_status,
          vendor_status: eventVendor.application_status,
        };
      });
      const vendorsData = await Promise.all(tableDataPromise);
      return vendorsData as Vendor[];
    },
    enabled: !!eventVendors,
  });
  return data;
};
