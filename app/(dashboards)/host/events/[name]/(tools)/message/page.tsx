import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import { getEventDisplayData } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import Message from "./components/Message";
import createSupabaseServerClient from "@/utils/supabase/server";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { data: eventsData } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
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
