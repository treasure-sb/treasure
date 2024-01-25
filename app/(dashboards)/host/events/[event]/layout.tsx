import EventToolsHeader from "./components/EventToolsHeader";
import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import { eventDisplayData } from "@/lib/helpers/events";

export default async function HostEventLayout({
  children,
  params: { event },
}: {
  children: React.ReactNode;
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .eq("cleaned_name", event)
    .single();

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
