import EventToolsHeader from "./components/EventToolsHeader";
import createSupabaseServerClient from "@/utils/supabase/server";
import { eventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";

export default async function HostEventLayout({
  children,
  params: { name },
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (!data || error) {
    return redirect("/host/events");
  }

  const displayData = await eventDisplayData([data]);
  const eventData = displayData[0];
  return (
    eventData && (
      <div className="space-y-4">
        <EventToolsHeader event={eventData} />
        {children}
      </div>
    )
  );
}
