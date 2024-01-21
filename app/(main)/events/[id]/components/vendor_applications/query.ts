import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

export const useInstagram = (profile: Tables<"profiles"> | undefined) => {
  const { data: instagramData } = useQuery({
    queryKey: ["user-instagram", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return;
      const supabase = createClient();
      const { data: instagramLinkData } = await supabase
        .from("links")
        .select("username")
        .eq("user_id", profile.id)
        .eq("application", "Instagram")
        .single();
      return instagramLinkData;
    },
    enabled: !!profile,
  });

  return instagramData?.username;
};

export const useEventVendorInformation = (event: Tables<"events"> | null) => {
  const { data: eventVendorData } = useQuery({
    queryKey: ["event", event?.id],
    queryFn: async () => {
      if (!event) return null;
      const supabase = createClient();
      const { data } = await supabase
        .from("application_vendor_information")
        .select("*")
        .eq("event_id", event?.id)
        .single();
      return data;
    },
    enabled: !!event,
  });
  return eventVendorData;
};

export const useTermsAndConditions = (event: Tables<"events"> | null) => {
  const { data: termsData } = useQuery({
    queryKey: ["terms", event?.id],
    queryFn: async () => {
      if (!event) return [];
      const supabase = createClient();
      const { data } = await supabase
        .from("application_terms_and_conditions")
        .select("term")
        .eq("event_id", event.id);
      return data;
    },
    enabled: !!event,
  });

  return termsData?.map((term) => term.term);
};
