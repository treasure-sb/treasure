import { Tables } from "@/types/supabase";
import { Separator } from "@/components/ui/separator";
import createSupabaseServerClient from "@/utils/supabase/server";
import ListHighlights from "./ListHighlights";
import { EventWithDates } from "@/types/event";

export type EventHighlightPhoto = {
  photoUrl: string;
  publicUrl: string;
  id: string;
};

export default async function PastHighlights({
  event,
}: {
  event: EventWithDates;
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
      <>
        <Separator />
        <section>
          <h3 className="font-semibold text-lg mb-2">
            {event.id === "a6ce6fdb-4ff3-4272-a358-6873e896b3e3"
              ? "Event Brochure"
              : "Event Gallery"}
          </h3>
          <ListHighlights highlights={highlightPictures} />
        </section>
      </>
    )
  );
}
