import createSupabaseServerClient from "@/utils/supabase/server";
import validateUser from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import EventDisplay from "@/components/events/EventDisplay";

export default async function Page() {
  const { data: userData } = await validateUser();
  if (!userData.user) {
    redirect("/account");
  }

  const supabase = await createSupabaseServerClient();
  const { data: eventData } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", userData.user.id);

  return (
    <main className="w-full max-w-md m-auto">
      <h1 className="font-bold text-2xl mb-6">My Events</h1>
      {!eventData ? (
        <p>You have no events</p>
      ) : (
        <div className="flex flex-col items-center space-y-12">
          {eventData.map((event) => (
            <EventDisplay key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
