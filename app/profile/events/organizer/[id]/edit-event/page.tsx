import { redirect } from "next/navigation";
import { validateUser } from "@/lib/actions/auth";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import createSupabaseServerClient from "@/utils/supabase/server";
import EditEventForm from "./EditEventForm";

export default async function Page({ params }: { params: { id: string } }) {
  const {
    data: { user },
  } = await validateUser();
  if (!user) {
    redirect("/login");
  }
  const supabase = await createSupabaseServerClient();
  const profile = await getProfile(user.id);
  const { event, eventError } = await getEventFromCleanedName(params.id);
  if (eventError) {
    redirect("/events");
  }

  // redirect if not organizer to another page
  if (event.organizer_id !== user.id && profile.role !== "admin") {
    redirect("/events");
  }

  // load the event tickets : FIXME : not using yet
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  // load the event tags
  const { data: pTags } = await supabase
    .from("event_tags")
    .select("*,tags(name)")
    .eq("event_id", event.id);

  // load the event poster
  const {
    data: { publicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);

  return (
    <main className="m-auto max-w-lg">
      <EditEventForm event={event} posterUrl={publicUrl} priorTags={pTags} />
    </main>
  );
}
