import { EventHighlightPhotos } from "../../types";
import { Tables } from "@/types/supabase";
import createSupabaseServerClient from "@/utils/supabase/server";
import PastHightlights from "./highlights/PastHighlights";
import EventGuests from "./guests/EventGuests";
import GeneralInfo from "./GeneralInfo";

export default async function EditEventInfo({
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

    const portfolioPictures: EventHighlightPhotos[] = await Promise.all(
      imagePromises
    );
    return portfolioPictures;
  };

  const highlightPictures = await getHighlightPictures();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="font-semibold">Event Guests</h2>
        <EventGuests event={event} />
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold">Past Event Highlights</h2>
        <PastHightlights event={event} previousHighlights={highlightPictures} />
      </div>
      <div>
        <h2 className="font-semibold"> General Event Information</h2>
        <GeneralInfo event={event} />
      </div>
    </div>
  );
}
