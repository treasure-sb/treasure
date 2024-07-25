import EventToolsHeader from "./components/EventToolsHeader";
import createSupabaseServerClient from "@/utils/supabase/server";
import { eventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { getEventDisplayData } from "@/lib/helpers/events";

export default async function HostEventLayout({
  children,
  params: { name },
}: {
  children: React.ReactNode;
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromCleanedName(name);

  if (eventError) {
    return redirect("/host/events");
  }

  const displayData = await getEventDisplayData(event);

  return (
    <div className="space-y-4">
      <EventToolsHeader event={displayData} />
      {children}
    </div>
  );
}
