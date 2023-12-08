import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingListUserEvents from "./LoadingListUserEvents";
import { User } from "@supabase/supabase-js";
import Filters from "../Filters";
import ListUserEvents from "./ListUserEvents";

export default async function Page() {
  const { data: userData } = await validateUser();
  if (!userData.user) {
    redirect("/account");
  }
  const user: User = userData.user;

  return (
    <main className="w-full max-w-6xl m-auto">
      <h1 className="font-bold text-2xl w-full">My Events</h1>
      <Filters />
      <ListUserEvents user={user} />
    </main>
  );
}
