import { createClient } from "@/utils/supabase/client";
import { eventDisplayData } from "@/lib/helpers/events";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useUser } from "../query";
import { EventWithDates } from "@/types/event";

export const useTables = () => {
  const user = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["tables", user],
    queryFn: async () => {
      const supabase = createClient();
      const { data: tablesData } = await supabase
        .from("event_tickets")
        .select("*, events!inner(*), tickets!inner(*)")
        .eq("attendee_id", user.id)
        .eq("tickets.name", "Table");

      if (!tablesData) return null;

      const events: EventWithDates[] = tablesData.map((table) => table.events);
      const eventsData = await eventDisplayData(events);
      return { eventsData, tablesData };
    },
    enabled: !!user,
  });

  return { data, isLoading };
};
