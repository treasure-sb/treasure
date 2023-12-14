import createSupabaseServerClient from "@/utils/supabase/server";
import EventsPage from "@/app/events/[id]/EventsPage";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*, vendors:profiles!event_vendors(*)")
    .eq("cleaned_name", params.id)
    .single();

  if (eventError) {
    redirect("/events");
  }

  return <EventsPage key={event.id} event={event} />;
}
