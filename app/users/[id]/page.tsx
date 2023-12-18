import createSupabaseServerClient from "@/utils/supabase/server";
import ProfileHeader from "./components/ProfileHeader";
import ProfileFilters from "./components/ProfileFilters";
import ListProfileEvents from "./components/ListProfileEvents";
import LoadingProfileListEvents from "./components/LoadingProfileListEvents";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

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

  return (
    <main className="m-auto max-w-lg md:max-w-6xl flex flex-col md:flex-row md:justify-between md:space-x-16">
      <ProfileHeader user={user} />
      <Separator className="md:hidden block mt-6 mb-0" />
      <div className="mt-4 md:mt-0 text-lg w-full">
        <ProfileFilters />
        {filter === "Vending" && (
          <Suspense fallback={<LoadingProfileListEvents />}>
            <ListProfileEvents filter={filter} user={user} />
          </Suspense>
        )}
        {filter === "Hosting" && (
          <Suspense fallback={<LoadingProfileListEvents />}>
            <ListProfileEvents filter={filter} user={user} />
          </Suspense>
        )}
      </div>
    </main>
  );
}
