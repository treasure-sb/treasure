import { EventHighlightPhotos } from "../../types";
import PastHightlights from "./PastHighlights";
import { Tables } from "@/types/supabase";

export default function EditEventInfo({
  event,
  previousHighlights,
}: {
  event: Tables<"events">;
  previousHighlights: EventHighlightPhotos[];
}) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="space-y-2">
        <h2 className="font-semibold">Past Event Highlights</h2>
        <PastHightlights
          event={event}
          previousHighlights={previousHighlights}
        />
      </div>
    </div>
  );
}
