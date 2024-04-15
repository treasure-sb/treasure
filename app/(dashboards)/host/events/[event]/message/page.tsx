import createSupabaseServerClient from "@/utils/supabase/server";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import Message from "./components/Message";
import { getEventDisplayData } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";

export default async function Page({
  params: { event },
}: {
  params: { event: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventsData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user?.id as string)
    .eq("cleaned_name", event)
    .single();

  const eventData: Tables<"events"> = eventsData;
  const eventDisplay = await getEventDisplayData(eventData);

  const { profile: hostProfile } = await getProfile(user?.id);

  return (
    <div className="max-w-3xl m-auto">
      <Message event={eventDisplay} host={hostProfile} />
    </div>
  );
}
