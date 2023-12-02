import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplay from "@/components/events/shared/EventDisplay";
import { validateUser } from "@/lib/actions/auth";
import AcceptButton from "./AcceptButton";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: { invite_token: string; event_id: string };
}) {
  const inviteToken = searchParams.invite_token || null;
  const eventId = searchParams.event_id || null;
  if (!inviteToken || !eventId) {
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

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
      redirect("/account");
    }

    const supabase = await createSupabaseServerClient();
    const vendorId = user.id;
    await supabase
      .from("event_vendors")
      .insert([{ event_id: eventId, vendor_id: vendorId }]);
    redirect(`/events/${eventId}`);
  };

  const handleDecline = async () => {
    "use server";
  };

  const {
    data: { publicUrl: eventPosterPublicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(eventData.poster_url);

  return (
    <main className="max-w-lg m-auto space-y-4">
      <h1 className="font-semibold text-xl text-center">
        You've been invited to be a vendor at {eventData.name}!
      </h1>
      <EventDisplay event={eventData} />
      <div className="flex space-x-2">
        <AcceptButton handleAccept={handleAccept} />
        <Button variant={"destructive"} className="w-full">
          Decline
        </Button>
      </div>
    </main>
  );
}
