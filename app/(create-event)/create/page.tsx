import { Suspense } from "react";
import createSupabaseServerClient from "@/utils/supabase/server";
import CreateEventForm from "./components/CreateEventForm";
import { Tables } from "@/types/supabase";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: allTagsData } = await supabase.from("tags").select("*");
  const tags: Tables<"tags">[] = allTagsData || [];

  return (
    <Suspense>
      <CreateEventForm tags={tags} />
    </Suspense>
  );
}
