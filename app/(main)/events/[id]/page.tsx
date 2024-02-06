import createSupabaseServerClient from "@/utils/supabase/server";
import EventsPage from "@/app/(main)/events/[id]/components/EventsPage";
import { redirect } from "next/navigation";
import { createTablesOnStripe } from "@/lib/actions/events";
import { Tables } from "@/types/supabase";

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
    .select("*")
    .eq("cleaned_name", params.id)
    .single();

  if (eventError) {
    redirect("/events");
  }

  // get all tables
  const { data } = await supabase.from("tables").select("*");
  const tables: Tables<"tables">[] = data || [];
  await createTablesOnStripe(tables);

  const { data: vendors, error: vendorError } = await supabase
    .from("event_vendors")
    .select("profiles(*)")
    .eq("event_id", eventData.id)
    .eq("payment_status", "PAID");

  const event = { ...eventData, vendors };

  return <EventsPage key={event.id} event={event} />;
}
