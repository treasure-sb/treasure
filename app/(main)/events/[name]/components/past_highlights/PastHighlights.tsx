import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import ListHighlights from "./ListHighlights";

export type EventHighlightPhoto = {
  photoUrl: string;
  publicUrl: string;
  id: string;
};

export default async function PastHighlights({
  event,
}: {
  event: Tables<"events">;
}) {
  const supabase = await createSupabaseServerClient();

  const { data: photoData } = await supabase
    .from("event_highlights")
    .select("*")
    .eq("event_id", event.id);

  const highlights: Tables<"event_highlights">[] = photoData || [];

  const getHighlightPictures = async () => {
    const imagePromises = highlights.map(async (picture) => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("event_highlights")
        .getPublicUrl(picture.picture_url);
      return { photoUrl: picture.picture_url, publicUrl, id: picture.id };
    });

    const highlightPictures: EventHighlightPhoto[] = await Promise.all(
      imagePromises
    );
    return highlightPictures;
  };

  const highlightPictures = await getHighlightPictures();

  return (
    highlightPictures &&
    highlightPictures.length > 0 && (
      <section>
        <h3 className="font-semibold text-lg mb-2">Past Event Highlights</h3>
        <ListHighlights highlights={highlightPictures} />
      </section>
    )
  );
}
