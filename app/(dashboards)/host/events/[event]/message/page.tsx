import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import MessageTables from "./components/MessageTables";
import { Tables } from "@/types/supabase";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .eq("cleaned_name", event)
    .single();

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", eventData.id);

  const tables: Tables<"tables">[] = tablesData || [];

  return (
    <div className="max-w-3xl m-auto">
      <MessageTables tables={tables} />
    </div>
  );
}
