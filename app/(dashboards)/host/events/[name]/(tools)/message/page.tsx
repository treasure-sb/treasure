import { validateUser } from "@/lib/actions/auth";
import { getEventDisplayData } from "@/lib/helpers/events";
import { getProfile } from "@/lib/helpers/profiles";
import { getEventFromCleanedName } from "@/lib/helpers/events";
import Message from "./components/Message";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const {
    data: { user },
  } = await validateUser();

  const { event } = await getEventFromCleanedName(name);
  const eventDisplay = await getEventDisplayData(event);

  const { profile: hostProfile } = await getProfile(user?.id);

  return (
    <div className="max-w-3xl m-auto">
      <Message event={eventDisplay} host={hostProfile!} />
    </div>
  );
}
