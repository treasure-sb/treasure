import UserHeader from "./components/UserHeader";
import UserOptions from "./components/filtering/UserOptions";
import Photos from "./components/Photos";
import ListEventsHosting from "./components/ListEventsHosting";
import Events from "./components/events/Events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import {
  getProfile,
  getProfileByUsername,
  getTempProfile,
  isHostOrCoHost,
} from "@/lib/helpers/profiles";
import { validateUser } from "@/lib/actions/auth";
import { Suspense } from "react";
import AdminEditButton from "./components/admin/AdminEditButton";

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
  const username = decodeURIComponent(params.id);
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

  const isHosting = await isHostOrCoHost(user.id);
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

  const { profile: loggedInProfile } = await getProfile(loggedInUser?.id);

  const isProfile = "bio" in user;
  const isAdmin = loggedInProfile?.role === "admin" || false;

  return (
    <main className="m-auto max-w-lg md:max-w-6xl md:flex md:space-x-8 relative min-h-[calc(100vh-220px)]">
      <UserHeader user={user} ownProfile={userOnOwnProfile} />
      <div className="mt-6 md:mt-0 text-lg w-full">
        {isProfile ? (
          <>
            <Suspense>
              <UserOptions />
            </Suspense>
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
      {isAdmin && !userOnOwnProfile && <AdminEditButton username={username} />}
    </main>
  );
}
