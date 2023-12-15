import createSupabaseServerClient from "@/utils/supabase/server";
import EventsPage from "@/app/events/[id]/EventsPage";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("name, description")
    .eq("cleaned_name", params.id)
    .single();

  if (eventError) {
    return {
      title: "Not Found",
      description: "Event not found",
    };
  }

  return {
    title: eventData.name,
    description: eventData.description,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*, vendors:profiles!event_vendors(*)")
    .eq("cleaned_name", params.id)
    .single();

  if (eventError) {
    redirect("/events");
  }

  return <EventsPage key={eventData.id} event={eventData} />;
}
