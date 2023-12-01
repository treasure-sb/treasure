import { redirect } from "next/navigation";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventDisplay from "@/components/events/shared/EventDisplay";
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

  // get event poster
  const {
    data: { publicUrl: eventPosterPublicUrl },
  } = await supabase.storage.from("posters").getPublicUrl(eventData.poster_url);

  if (eventError) {
    redirect("/");
  }

  return (
    <main className="max-w-lg m-auto space-y-4">
      <h1 className="font-semibold text-xl text-center">
        You've been invited to be a vendor at {eventData.name}!
      </h1>
      <EventDisplay event={eventData} />
      <div className="flex space-x-2">
        <Button className="w-full">Accept</Button>
        <Button className="w-full" variant={"destructive"}>
          Decline
        </Button>
      </div>
    </main>
  );
}
