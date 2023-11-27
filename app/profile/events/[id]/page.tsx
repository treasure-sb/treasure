import createSupabaseServerClient from "@/utils/supabase/server";
import EventsPage from "@/components/events/events-public/EventsPage";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const event_id = params.id;
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", event_id)
    .single();

  return <EventsPage key={event.id} event={event} />;
}
