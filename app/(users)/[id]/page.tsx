import createSupabaseServerClient from "@/utils/supabase/server";
import UserHeader from "./components/UserHeader";
import UserFilters from "./components/UserFilters";
import ListUserEvents from "./components/ListUserEvents";
import LoadingUserListEvents from "./components/LoadingUserListEvents";
import format from "date-fns/format";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Portfolio from "./components/Portfolio";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    filter: string;
  };
}) {
  const filter = searchParams?.filter || "Portfolio";
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.id)
    .single();

  if (userError) {
    redirect("/events");
  }

  const user: Tables<"profiles"> = userData;
  const formattedJoinedDate = format(new Date(user.created_at), "MMMM yyyy");

  return (
    <main className="m-auto max-w-lg md:max-w-6xl flex flex-col justify-between min-h-[calc(100vh-220px)]">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <UserHeader user={user} />
        <Separator className="md:hidden block mt-6 mb-0" />
        <div className="mt-4 md:mt-0 text-lg w-full md:border-l md:pl-8">
          <UserFilters />
          {filter === "Events" ? (
            <Suspense fallback={<LoadingUserListEvents />}>
              <ListUserEvents filter={filter} user={user} />
            </Suspense>
          ) : (
            <Portfolio user={user} />
          )}
        </div>
      </div>
    </main>
  );
}
