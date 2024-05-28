import createSupabaseServerClient from "@/utils/supabase/server";
import Link from "next/link";
import EditEventForm from "./components/header/EditEventForm";
import EditTicketTables from "./components/header/EditTicketTables";
import Blurred from "@/app/(main)/events/[name]/components/Blurred";
import { ArrowUpLeft } from "lucide-react";
import { Tables } from "@/types/supabase";
import { redirect } from "next/navigation";
import { getEventDisplayData } from "@/lib/helpers/events";
import { EventHighlightPhotos } from "./types";
import PastHighlights from "./components/event_info/highlights/PastHighlights";
import EventGuests from "./components/event_info/guests/EventGuests";

export default async function Page({
  params: { name },
}: {
  params: { name: string };
}) {
  const supabase = await createSupabaseServerClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("cleaned_name", name)
    .single();

  if (eventError || !eventData) {
    redirect("/host/events");
  }

  const event: Tables<"events"> = eventData || [];
  const eventDisplayData = await getEventDisplayData(event);

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  const tickets: Tables<"tickets">[] = ticketsData || [];

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  const tables: Tables<"tables">[] = tablesData || [];

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
    <main className="relative">
      <div className="max-w-6xl mx-auto">
        <Link
          href={`/host/events/${event.cleaned_name}`}
          className="flex space-x-1 items-center mb-4 group cursor-pointer w-fit"
        >
          <ArrowUpLeft className="group-hover:-translate-x-[0.15rem] group-hover:-translate-y-[0.15rem] transition duration-300" />
          <p className="md:text-lg">Event Tools</p>
        </Link>
      </div>
      <EditEventForm event={eventDisplayData} tickets={tickets} />
      <div className="md:max-w-[1160px] mx-auto flex justify-end">
        <div className="max-w-2xl justify-end flex-grow flex flex-col space-y-8 md:space-y-3">
          <EditTicketTables
            tickets={tickets}
            tables={tables}
            eventId={event.id}
          />
          <EventGuests event={event} />
          <PastHighlights
            event={event}
            previousHighlights={highlightPictures}
          />
        </div>
      </div>
      <Blurred posterUrl={eventDisplayData.publicPosterUrl} />
    </main>
  );
}
