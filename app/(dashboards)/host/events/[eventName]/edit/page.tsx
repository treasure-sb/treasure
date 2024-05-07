import createSupabaseServerClient from "@/utils/supabase/server";
import EditTickets from "./components/tickets/EditTickets";
import EditEventInfo from "./components/event_info/EditEventInfo";
import EditVendors from "./components/vendors/EditVendors";
import EditState from "./components/EditState";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";

export default async function Page({
  params: { eventName },
}: {
  params: { eventName: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();

  if (eventError || !eventData) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData || [];

  return (
    <main>
      <EditState>
        <EditEventInfo event={event} />
        <EditTickets event={event} />
        <EditVendors event={event} />
      </EditState>
    </main>
  );
}
