import createSupabaseServerClient from "@/utils/supabase/server";
import PromoCodes from "./components/PromoCodes";
import BasicEventInfo from "./components/BasicEventInfo";
import TicketsInfo from "./components/TicketsInfo";
import TablesInfo from "./components/TablesInfo";
import SelectEdit from "./components/SelectEdit";
import AllEdit from "./components/AllEdit";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { EventHighlightPhotos } from "./types";

export default async function Page({
  params: { eventName },
}: {
  params: { eventName: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", eventName)
    .single();

  if (eventError || !eventData) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData || [];

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id);

  const tickets: Tables<"tickets">[] = ticketsData || [];

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

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id);

  const tables = tablesData as Tables<"tables">[];

  const { data: codesData } = await supabase
    .from("event_codes")
    .select("*")
    .eq("event_id", event.id);

  const codes = codesData as Tables<"event_codes">[];

  return (
    <main>
      <AllEdit
        tickets={tickets}
        event={event}
        previousHighlights={highlightPictures}
      />
    </main>
  );
}
