import { Suspense } from "react";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import CreateEvent from "./components/CreateEvent";
import createSupabaseServerClient from "@/utils/supabase/server";
import { getPublicPosterUrl } from "@/lib/helpers/events";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    d?: string;
  };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: allTagsData } = await supabase.from("tags").select("*");
  const tags: Tables<"tags">[] = allTagsData || [];

  const draftId = searchParams.d || null;
  let draft: Tables<"events"> | null = null;

  if (draftId) {
    const { data: draftData, error: draftError } = await supabase
      .from("events")
      .select("*")
      .eq("id", draftId)
      .single();

    if (!draftError) {
      draft = draftData;
      const posterUrl = await getPublicPosterUrl(draft!.poster_url);
      draft!.poster_url = posterUrl;
    }
  }

  const {
    data: { user },
  } = await validateUser();

  const { profile } = await getProfile(user?.id);

  return (
    <Suspense>
      <CreateEvent tags={tags} user={profile} draft={draft} />
    </Suspense>
  );
}
