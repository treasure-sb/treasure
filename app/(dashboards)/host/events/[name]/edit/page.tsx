import createSupabaseServerClient from "@/utils/supabase/server";
import EditTickets from "./components/tickets/EditTickets";
import EditEventInfo from "./components/event_info/EditEventInfo";
import EditVendors from "./components/vendors/EditVendors";
import EditState from "./components/EditState";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import EditHeader from "./components/header/EditHeader";
import { getEventDisplayData } from "@/lib/helpers/events";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError || !eventData) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData || [];
  const eventDisplayData = await getEventDisplayData(event);

  return (
    <main className="max-w-5xl mx-auto">
      <EditHeader event={eventDisplayData} />
      <EditState>
        <EditEventInfo event={event} />
        <EditTickets event={event} />
        <EditVendors event={event} />
      </EditState>
    </main>
  );
}
