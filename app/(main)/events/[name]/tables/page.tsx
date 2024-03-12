import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import AllTables from "./components/AllTables";
import createSupabaseServerClient from "@/utils/supabase/server";
import TablesFlow from "./components/TablesFlow";

export default async function Page({
  params,
}: {
  params: {
    name: string;
  };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { name } = params;
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError) {
    redirect("/events");
  }

  const event: Tables<"events"> = eventData;
  const eventDisplayData = await getEventDisplayData(event);

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });
  const tables: Tables<"tables">[] = tablesData || [];

  return (
    <TablesFlow eventDisplay={eventDisplayData} tables={tables} user={user} />
  );
}
