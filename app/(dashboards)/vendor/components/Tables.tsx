import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "../store";
import { Skeleton } from "@/components/ui/skeleton";
import { eventDisplayData } from "@/lib/helpers/events";
import Image from "next/image";

export default function Tables() {
  const { user } = useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      if (!user) return null;
      const supabase = createClient();
      const { data: tablesData } = await supabase
        .from("event_tickets")
        .select("*, events!inner(*), tickets!inner(*)")
        .eq("attendee_id", user.id)
        .eq("tickets.name", "Table");

      if (!tablesData) return null;

      const events = tablesData.map((table) => table.events);
      const eventsData = await eventDisplayData(events);
      return { eventsData, tablesData };
    },
    enabled: !!user,
  });

  const { eventsData, tablesData } = data ?? {};
  return (
    <div className="bg-background border-[1px] p-6 rounded-3xl my-4">
      <h1 className="text-2xl font-semibold text-left mb-6">Tables</h1>
      {(isLoading || !user) && (
        <div className="h-60 space-y-4">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-[80%] rounded-md" />
        </div>
      )}
      {eventsData && eventsData.length > 0 && (
        <>
          <p className="mb-2">
            You're vending at{" "}
            <span className="font-semibold">{eventsData[0].name}!</span>
          </p>
          <div className="group aspect-square w-full relative">
            <Image
              className="object-cover h-full w-full rounded-md"
              alt="image"
              src={eventsData[0].publicPosterUrl}
              width={200}
              height={200}
            />
          </div>
        </>
      )}
    </div>
  );
}
