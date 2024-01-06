import UserHeader from "./components/UserHeader";
import UserFilters from "./components/filtering/UserFilters";
import LoadingUserListEvents from "./components/LoadingUserListEvents";
import Portfolio from "./components/Portfolio";
import ListEventsHosting from "./components/ListEventsHosting";
import Events from "./components/events/Events";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
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
  const filter = searchParams?.tab || "Events";
  const eventsFilter = searchParams?.events || "Hosting";
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

  // determine if user is a profile or a temp profile
  const isProfile = "bio" in user;

  // determine if logged in user is viewing their own profile
  const {
    data: { user: loggedInUser },
  } = await validateUser();
  const ownProfile = (loggedInUser && loggedInUser.id === user.id) || false;

  return (
    <main className="m-auto max-w-lg md:max-w-6xl flex flex-col justify-between min-h-[calc(100vh-220px)]">
      <div className="flex flex-col md:flex-row md:space-x-8 relative">
        <UserHeader user={user} ownProfile={ownProfile} />
        <div className="mt-4 md:mt-0 text-lg w-full">
          {isProfile ? (
            <>
              <UserFilters />
              <Separator className="md:hidden block my-6 mt-2" />
              {filter === "Photos" ? (
                <Portfolio user={user as Tables<"profiles">} />
              ) : (
                <Suspense fallback={<LoadingUserListEvents />}>
                  <Events
                    eventsFilter={eventsFilter}
                    user={user as Tables<"profiles">}
                    loggedInUser={loggedInUser}
                  />
                </Suspense>
              )}
            </>
          ) : (
            <Suspense fallback={<LoadingUserListEvents />}>
              <ListEventsHosting user={user as Tables<"temporary_profiles">} />
            </Suspense>
          )}
        </div>
      </div>
    </main>
  );
}
