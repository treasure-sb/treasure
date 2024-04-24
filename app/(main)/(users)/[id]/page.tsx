import UserHeader from "./components/UserHeader";
import UserOptions from "./components/filtering/UserOptions";
import Photos from "./components/Photos";
import ListEventsHosting from "./components/ListEventsHosting";
import Events from "./components/events/Events";
import { getEventsHosting } from "@/lib/helpers/eventsFiltering";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getProfileByUsername, getTempProfile } from "@/lib/helpers/profiles";
import { validateUser } from "@/lib/actions/auth";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    tab: string;
    events: string;
    type: string;
  };
}) {
  const username = params.id;
  const tab = searchParams?.tab || "Events";
  const filter = searchParams?.events;
  const type = searchParams?.type || "profile";
  let user: Tables<"profiles"> | Tables<"temporary_profiles">;

  if (type === "profile") {
    const { profile, error } = await getProfileByUsername(username);
    if (error) {
      redirect("/events");
    }
    user = profile;
  } else {
    const { tempProfile, error } = await getTempProfile(username);
    if (error) {
      redirect("/events");
    }
    user = tempProfile;
  }

  const { data: hostingData } = await getEventsHosting(1, user.id);
  const isHosting = hostingData ? hostingData.length > 0 : false;
  const eventsFilter = filter
    ? filter
    : isHosting && !searchParams?.events
    ? "Hosting"
    : "Attending";

  const {
    data: { user: loggedInUser },
  } = await validateUser();

  const userOnOwnProfile =
    (loggedInUser && loggedInUser.id === user.id) || false;
  const isProfile = "bio" in user;

  return (
    <main className="m-auto max-w-lg md:max-w-6xl md:flex md:space-x-8 relative min-h-[calc(100vh-220px)]">
      <UserHeader user={user} ownProfile={userOnOwnProfile} />
      <div className="mt-6 md:mt-0 text-lg w-full">
        {isProfile ? (
          <>
            <UserOptions />
            {tab === "Photos" ? (
              <Photos user={user as Tables<"profiles">} />
            ) : (
              <Events
                eventsFilter={eventsFilter}
                user={user as Tables<"profiles">}
                loggedInUser={loggedInUser}
                isHosting={isHosting}
              />
            )}
          </>
        ) : (
          <ListEventsHosting user={user as Tables<"temporary_profiles">} />
        )}
      </div>
    </main>
  );
}
