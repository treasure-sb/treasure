import createSupabaseServerClient from "@/utils/supabase/server";
import PromoCodes from "./components/PromoCodes";
import BasicEventInfo from "./components/BasicEventInfo";
import TicketsInfo from "./components/TicketsInfo";
import TablesInfo from "./components/TablesInfo";
import SelectEdit from "./components/SelectEdit";
import AllEdit from "./components/AllEdit";
import { Tables } from "@/types/supabase";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventID } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", event)
    .single();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const tickets: Tables<"tickets">[] = ticketsData || [];

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const tables = tablesData as Tables<"tables">[];

  const { data: codesData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", eventID && eventID["id"]);

  const codes = codesData as Tables<"event_codes">[];

  return (
    <main>
      <AllEdit tickets={tickets} />
    </main>
  );
}
