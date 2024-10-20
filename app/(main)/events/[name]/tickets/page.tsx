import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";
import AllTickets from "./components/regular/AllTickets";
import AllTicketsSampa from "./components/sampa/AllTicketsSampa";
import { LiveTicket } from "@/types/tickets";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  const { event, eventError } = await getEventFromCleanedName(params.name);

  if (eventError) {
    return {
      title: "Not Found",
      description: "Event tickets not found",
    };
  }

  return {
    title: `${event.name} Tickets`,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    name: string;
  };
  searchParams: {
    embed?: string;
  };
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await validateUser();

  const { event, eventError } = await getEventFromCleanedName(params.name);
  const eventDisplayData = await getEventDisplayData(event);

  if (eventError) {
    redirect("/events");
  }

  const { data: ticketData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: false });
  const tickets: LiveTicket[] = ticketData || [];

  const isSampa =
    eventDisplayData.id === "a6ce6fdb-4ff3-4272-a358-6873e896b3e3";

  const { data: guestProfileData } = await supabase
    .from("profiles")
    .select("id")
    .eq("guest", true)
    .single();

  const guestProfileId: string = guestProfileData?.id || "";

  return (
    <main className="max-w-lg m-auto">
      {isSampa ? (
        <AllTicketsSampa
          event={eventDisplayData}
          tickets={tickets}
          user={user}
        />
      ) : (
        <AllTickets
          event={eventDisplayData}
          tickets={tickets}
          user={user}
          embed={searchParams.embed ? true : false}
          guestProfileId={guestProfileId}
        />
      )}
    </main>
  );
}
