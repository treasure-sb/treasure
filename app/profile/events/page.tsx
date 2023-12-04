import { validateUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ListUserEvents from "./ListUserEvents";
import LoadingListUserEvents from "./LoadingListUserEvents";
import EventCardSkeleton from "@/components/events/skeletons/EventCardSkeleton";

export default async function Page() {
  const { data: userData } = await validateUser();
  if (!userData.user) {
    redirect("/account");
  }

  return (
    <main className="w-full max-w-md m-auto">
      <div className="font-bold text-2xl mb-6 w-full text-center">
        <h1>My Events</h1>
      </div>
      <Suspense fallback={<LoadingListUserEvents />}>
        <ListUserEvents userData={userData} />
      </Suspense>
    </main>
  );
}
