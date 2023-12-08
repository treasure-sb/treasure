import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ListUserEvents from "./ListUserEvents";
import ListAppliedEvents from "./ListAppliedEvents";
import LoadingListUserEvents from "./LoadingListUserEvents";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Filters from "../Filters";

export default async function Page() {
  const { data: userData } = await validateUser();
  if (!userData.user) {
    redirect("/account");
  }
  const user: User = userData.user;

  return (
    <main className="w-full max-w-md m-auto">
      <h1 className="font-bold text-2xl w-full">My Events</h1>
      <Filters />
      <Suspense fallback={<LoadingListUserEvents />}>
        <ListUserEvents user={user} />
      </Suspense>
      <h1 className="mt-10 text-xl">Applied to:</h1>
      <Suspense fallback={<LoadingListUserEvents />}>
        <ListAppliedEvents user={user} />
      </Suspense>
    </main>
  );
}
