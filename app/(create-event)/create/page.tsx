import { Suspense } from "react";
import { Tables } from "@/types/supabase";
import { validateUser } from "@/lib/actions/auth";
import { getProfile } from "@/lib/helpers/profiles";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import CreateEvent from "./components/CreateEvent";
import createSupabaseServerClient from "@/utils/supabase/server";

export type AllEventData = Tables<"events"> & {
  dates: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
};

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
  let draft: AllEventData | null = null;

  if (draftId) {
    const { data: draftData, error: draftError } = await supabase
      .from("events")
      .select(
        "*, dates:event_dates(date, startTime:start_time, endTime:end_time)"
      )
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

  console.log(draft);

  return (
    <Suspense>
      <CreateEvent tags={tags} user={profile} draft={draft} />
    </Suspense>
  );
}
