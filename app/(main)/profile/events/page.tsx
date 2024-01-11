import { validateUser } from "@/lib/actions/auth";
import { Suspense } from "react";
import { User } from "@supabase/supabase-js";
import EventFilters from "./components/EventFilters";
import UserEvents from "./components/UserEvents";
import LoadingListEvents from "@/components/events/shared/LoadingListEvents";

export default async function Page({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const { data: userData } = await validateUser();
  const user: User = userData.user as User;

  return (
    <main className="w-full max-w-6xl m-auto">
      <h1 className="font-bold text-2xl w-full">My Events</h1>
      <EventFilters />
      <Suspense fallback={<LoadingListEvents />}>
        <UserEvents searchParams={searchParams} user={user} />
      </Suspense>
    </main>
  );
}
