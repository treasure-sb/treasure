import { useUser } from "../query";
import { eventDisplayData } from "@/lib/helpers/events";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
