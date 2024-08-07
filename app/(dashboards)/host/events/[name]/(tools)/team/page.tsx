import createSupabaseServerClient from "@/utils/supabase/server";
import AddMember from "./components/AddMember";
import ListMembers from "./components/ListMembers";
import RolesDescription from "./components/RolesDescription";
import { getEventDisplayData } from "@/lib/helpers/events";
import { EventWithDates } from "@/types/event";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: eventsData } = await supabase
    .from("events")
    .select("*, dates:event_dates(date, start_time, end_time)")
    .eq("cleaned_name", name)
    .single();

  const eventData: EventWithDates = eventsData;
  const eventDisplay = await getEventDisplayData(eventData);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2 items-start md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold mt-8">Manage Team</h1>
          <h3 className="text-base text-muted-foreground">
            These people are part of this event's organization.
          </h3>
        </div>
        <AddMember event={eventDisplay} />
      </div>
      <ListMembers event={eventDisplay} />
      <RolesDescription />
    </div>
  );
}
