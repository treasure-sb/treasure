import createSupabaseServerClient from "@/utils/supabase/server";
import SeeTables from "./SeeTables";
import { EventWithDates } from "@/types/event";

export default async function VendorTables({
  event,
}: {
  event: EventWithDates;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  return (
    tablesData &&
    tablesData.length > 0 && <SeeTables tables={tablesData} event={event} />
  );
}
