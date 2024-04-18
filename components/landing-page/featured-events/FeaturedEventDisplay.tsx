import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FeaturedEventImageLink from "./FeaturedEventImageLink";

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
