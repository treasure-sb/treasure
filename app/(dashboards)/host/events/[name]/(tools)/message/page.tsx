import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import { getEventDisplayData } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import Message from "./components/Message";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getEventFromCleanedName } from "@/lib/helpers/events";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await validateUser();

  const { event, eventError } = await getEventFromCleanedName(name);
  const eventDisplay = await getEventDisplayData(event);

  const { profile: hostProfile } = await getProfile(user?.id);

  return (
    <div className="max-w-3xl m-auto">
      <Message event={eventDisplay} host={hostProfile} />
    </div>
  );
}
