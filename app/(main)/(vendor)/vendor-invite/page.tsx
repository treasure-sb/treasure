import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplay from "@/components/events/shared/EventDisplay";
import AcceptButton from "./AcceptButton";
import { Button } from "@/components/ui/button";
import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import {
  getEventFromCleanedName,
  getEventDisplayData,
} from "@/lib/helpers/events";

export default async function Page({
  searchParams,
}: {
  searchParams: { invite_token: string; event_name: string };
}) {
  const inviteToken = searchParams.invite_token || null;
  const eventUrl = searchParams.event_name || null;
  if (!inviteToken || !eventUrl) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { event, eventError } = await getEventFromCleanedName(eventUrl);
  const eventDisplay = await getEventDisplayData(event);

  if (eventError) {
    redirect("/");
  }

  // validate token
  const { data: inviteTokenData, error: inviteTokenError } = await supabase
    .from("vendor_invite_tokens")
    .select("*")
    .eq("token", inviteToken)
    .single();

  if (inviteTokenError) {
    redirect("/");
  }

  // validate token is not expired
  const now = new Date();
  const expirationDate = new Date(inviteTokenData.expires_at);
  if (now > expirationDate) {
    redirect("/");
  }

  // have to handle this if user is logged in or not
  const handleAccept = async () => {
    "use server";
    const {
      data: { user },
    } = await validateUser();
    if (!user) {
      redirect(`/signup?invite_token=${inviteToken}&event_name=${eventUrl}`);
    }

    const supabase = await createSupabaseServerClient();
    const vendorId = user.id;
    await supabase
      .from("event_vendors")
      .insert([{ event_id: event.id, vendor_id: vendorId }]);
    redirect(`/events/${eventUrl}`);
  };

  const handleDecline = async () => {
    "use server";
  };

  const {
    data: { publicUrl: eventPosterPublicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(event.poster_url);

  return (
    <main className="max-w-lg m-auto space-y-4">
      <h1 className="font-semibold text-xl text-center">
        You've been invited to be a vendor at {event.name}!
      </h1>
      <EventDisplay event={eventDisplay} />
      <div className="flex space-x-2">
        <AcceptButton handleAccept={handleAccept} />
        <Button variant={"destructive"} className="w-full">
          Decline
        </Button>
      </div>
    </main>
  );
}
