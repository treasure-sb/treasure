import { Suspense } from "react";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import CreateEvent from "./components/CreateEvent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getProfile } from "@/lib/helpers/profiles";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: allTagsData } = await supabase.from("tags").select("*");
  const tags: Tables<"tags">[] = allTagsData || [];

  const {
    data: { user },
  } = await validateUser();

  const { profile } = await getProfile(user?.id);

  return (
    <Suspense>
      <CreateEvent tags={tags} user={profile} />
    </Suspense>
  );
}
