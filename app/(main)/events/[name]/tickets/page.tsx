import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import createSupabaseServerClient from "@/utils/supabase/server";
import AllTickets from "./components/AllTickets";

export default async function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const supabase = await createSupabaseServerClient();
  const eventName = params.name;

  const {
    data: { user },
  } = await validateUser();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();
  const event: Tables<"events"> = eventData;
  const eventDisplayData = await getEventDisplayData(event);

  if (eventError) {
    redirect("/events");
  }

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });
  const tickets: Tables<"tickets">[] = ticketData || [];

  return (
    <main className="max-w-lg m-auto">
      <AllTickets
        eventDisplayData={eventDisplayData}
        tickets={tickets}
        user={user}
      />
    </main>
  );
}
