import createSupabaseServerClient from "@/utils/supabase/server";
import EventPage from "@/app/(event-page)/events/[name]/components/EventPage";
import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("name, description")
    .eq("cleaned_name", params.name)
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

export default async function Page({ params }: { params: { name: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", params.name)
    .single();

  if (eventError) {
    redirect("/events");
  }

  const event: Tables<"events"> = eventData;

  return <EventPage key={event.id} event={event} />;
}
