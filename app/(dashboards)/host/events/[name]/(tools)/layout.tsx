import EventToolsHeader from "./components/EventToolsHeader";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventDisplayData } from "@/lib/helpers/events";
import { redirect } from "next/navigation";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import { RoleMapKey } from "./team/components/ListMembers";

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

  const eventData: Tables<"events"> = data;
  const eventDisplay = await getEventDisplayData(eventData);

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
    eventData && (
      <div className="space-y-4">
        <EventToolsHeader event={eventDisplay} role={role} />
        {children}
      </div>
    )
  );
}
