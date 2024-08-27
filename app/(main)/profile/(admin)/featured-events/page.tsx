import { getProfile } from "@/lib/helpers/profiles";
import { validateUser } from "@/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import EventSearch from "./components/EventSearch";
import FeatureEventDisplay from "./components/FeatureEventDisplay";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;
  const { profile } = await getProfile(user.id);

  if (profile!.role !== "admin") {
    redirect("/profile/events");
  }

  const supabase = await createSupabaseServerClient();
  const search = searchParams?.search || "";
  let events: Partial<Tables<"events">>[] = [];

  // get events currently being featured
  const { data: featuredEventsData, error: featuredEventsError } =
    await supabase
      .from("events")
      .select("id, poster_url, name, featured")
      .gt("featured", 0);
  events = featuredEventsData || [];

  // if there is a search query, get events that match the query
  if (search) {
    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("id, poster_url, name, featured")
      .ilike("name", `%${search}%`)
      .order("name", { ascending: true });
    events = eventsData || [];
  }

  return (
    <main className="w-full max-w-xl m-auto">
      <h1 className="font-bold text-2xl w-full">Featured Events</h1>
      <Suspense>
        <EventSearch />
      </Suspense>
      <div className="flex flex-col space-y-8 mt-6 items-center">
        {events.map((event) => (
          <FeatureEventDisplay key={event.id} event={event} />
        ))}
      </div>
    </main>
  );
}
