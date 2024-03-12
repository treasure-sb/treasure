"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Tables } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { CalendarCheck2Icon, CalendarX2Icon } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function AttendingEvent({
  event,
  user,
}: {
  event: Tables<"events">;
  user: User | null;
}) {
  const supabase = createClient();
  const { data } = useQuery({
    queryKey: ["event_attending", event.id],
    queryFn: async () => {
      if (!user) return false;
      const { data: attendingEvents } = await supabase
        .from("event_guests")
        .select("guest_id")
        .eq("event_id", event.id)
        .eq("guest_id", user.id);
      return attendingEvents && attendingEvents.length > 0;
    },
  });

  const { push } = useRouter();
  const queryClient = useQueryClient();

  const handleAttending = async () => {
    if (!user) {
      push(`/login?event=${event.cleaned_name}`);
      return;
    }

    // Optimistically update the UI by immediately setting the data to the opposite of what it was
    queryClient.setQueryData(
      ["event_attending", event.id],
      data ? false : true
    );
    if (data) {
      await supabase
        .from("event_guests")
        .delete()
        .eq("event_id", event.id)
        .eq("guest_id", user.id);
    } else {
      await supabase
        .from("event_guests")
        .insert([{ guest_id: user.id, event_id: event.id }]);
    }

    // Invalidate the query to refetch the data
    queryClient.invalidateQueries({ queryKey: ["event_liked", event.id] });
  };

  return data ? (
    <Button
      onClick={handleAttending}
      className="z-[60] opacity-70 hover:opacity-50 bg-primary w-fit text-background text-md font-bold active:bg-white"
    >
      <h1>Attending</h1>
      <CalendarCheck2Icon className="ml-2" />
    </Button>
  ) : (
    <Button
      onClick={handleAttending}
      className="z-[60] hover:opacity-70 bg-tertiary hover:bg-tertiary h-full w-fit text-background text-md font-bold"
    >
      <h1>Not Attending</h1>
      <CalendarX2Icon className="ml-2" />
    </Button>
  );
}
