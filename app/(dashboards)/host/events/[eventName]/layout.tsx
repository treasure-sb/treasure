import EventToolsHeader from "./components/EventToolsHeader";
import createSupabaseServerClient from "@/utils/supabase/server";
import { eventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";

export default async function HostEventLayout({
  children,
  params: { eventName },
}: {
  children: React.ReactNode;
  params: { eventName: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();

  if (!data || error) {
    return redirect("/host/events");
  }

  const displayData = await eventDisplayData([data]);
  const eventData = displayData[0];
  return (
    eventData && (
      <div className="space-y-10">
        <EventToolsHeader event={eventData} />
        {children}
      </div>
    )
  );
}
