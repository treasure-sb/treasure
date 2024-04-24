import createSupabaseServerClient from "@/utils/supabase/server";
import FeaturedEventImageLink from "./FeaturedEventImageLink";
import { Tables } from "@/types/supabase";

export default async function FeaturedEventDisplay({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.storage
    .from("posters")
    .getPublicUrl(event.poster_url, {
      transform: {
        width: 800,
        height: 800,
      },
    });

  return (
    <div className="relative w-full bg-foreground rounded-md group">
      <FeaturedEventImageLink event={event} publicUrl={data.publicUrl} />
    </div>
  );
}
