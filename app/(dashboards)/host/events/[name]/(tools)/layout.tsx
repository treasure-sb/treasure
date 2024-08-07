import EventToolsHeader from "./components/EventToolsHeader";
import { redirect } from "next/navigation";
import { validateUser } from "@/lib/actions/auth";
import { RoleMapKey } from "./team/components/ListMembers";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { getEventDisplayData } from "@/lib/helpers/events";
import createSupabaseServerClient from "@/utils/supabase/server";

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

  const eventDisplay = await getEventDisplayData(event);

  const {
    data: { user },
  } = await validateUser();

  const { data: roleData } = await supabase
    .from("event_roles")
    .select("role")
    .eq("event_id", eventDisplay.id)
    .eq("user_id", user!.id)
    .single();

  const role: RoleMapKey = roleData?.role as RoleMapKey;

  return (
    event && (
      <div className="space-y-4">
        <EventToolsHeader event={eventDisplay} role={role} />
        {children}
      </div>
    )
  );
}
