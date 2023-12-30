import UserHeader from "./components/UserHeader";
import UserFilters from "./components/UserFilters";
import ListUserEvents from "./components/ListUserEvents";
import LoadingUserListEvents from "./components/LoadingUserListEvents";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Portfolio from "./components/Portfolio";
import { getProfileByUsername, getTempProfile } from "@/lib/helpers/profiles";
import ListEventsHosting from "./components/ListEventsHosting";

export default async function Page({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams?: {
    filter: string;
    type: string;
  };
}) {
  const username = params.username;
  const filter = searchParams?.filter || "Events";
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
  const isProfile = () => "bio" in user;

  return (
    <main className="m-auto max-w-lg md:max-w-6xl flex flex-col justify-between min-h-[calc(100vh-220px)]">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <UserHeader user={user} />
        <Separator className="md:hidden block mt-6 mb-0" />
        <div className="mt-4 md:mt-0 text-lg w-full md:border-l md:pl-8">
          {isProfile() ? (
            <>
              <UserFilters />
              {filter === "Events" ? (
                <Suspense fallback={<LoadingUserListEvents />}>
                  <ListUserEvents
                    filter={filter}
                    user={user as Tables<"profiles">}
                  />
                </Suspense>
              ) : (
                <Portfolio user={user as Tables<"profiles">} />
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
