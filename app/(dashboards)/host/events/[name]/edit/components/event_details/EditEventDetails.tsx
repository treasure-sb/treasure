import EventPoster from "@/components/events/shared/EventPoster";
import EditEventForm from "./EditEventForm";
import EditTicketTables from "./EditTicketTables";
import EventGuests from "./guests/EventGuests";
import PastHighlights from "./highlights/PastHighlights";
import Blurred from "@/app/(event-page)/events/[name]/components/Blurred";
import createSupabaseServerClient from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getEditEventDisplayData } from "@/lib/helpers/events";
import { EventHighlightPhoto } from "../../types";
import { EditEventWithDates } from "@/types/event";

export type TicketDetails = Tables<"tickets"> & {
  ticket_dates: Tables<"ticket_dates">[];
};

export default async function EditEventDetails({
  event,
}: {
  event: EditEventWithDates;
}) {
  const supabase = await createSupabaseServerClient();
  const eventDisplayData = await getEditEventDisplayData(event);

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*, ticket_dates(*)")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  const tickets: TicketDetails[] = ticketsData || [];

  const { data: eventDatesData } = await supabase
    .from("event_dates")
    .select("*")
    .eq("event_id", event.id);

  const eventDates: Tables<"event_dates">[] = eventDatesData || [];

  const { data: tablesData } = await supabase
    .from("tables")
    .select("*")
    .eq("event_id", event.id)
    .order("price", { ascending: true });

  const tables: Tables<"tables">[] = tablesData || [];

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", event.id)
    .returns<{ tags: Tables<"tags"> }[]>();

  const { data: allTagsData } = await supabase.from("tags").select("*");

  const eventTags: Tables<"tags">[] = tagsData?.map((tag) => tag.tags) || [];
  const allTags: Tables<"tags">[] = allTagsData || [];

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

    const portfolioPictures: EventHighlightPhoto[] = await Promise.all(
      imagePromises
    );
    return portfolioPictures;
  };

  const highlightPictures = await getHighlightPictures();

  return (
    <div>
      <EditEventForm
        event={eventDisplayData}
        initialTags={eventTags}
        allTags={allTags}
      />
      <div className="mx-auto flex justify-between md:space-x-14">
        <div className="md:inline-block hidden">
          <div className="w-full max-w-xl relative z-10">
            <EventPoster hidden posterUrl={eventDisplayData.publicPosterUrl} />
          </div>
        </div>
        <div className="w-full max-w-xl md:max-w-2xl relative z-20 space-y-3 mx-auto md:mx-0">
          <EditTicketTables
            tickets={tickets}
            eventDates={eventDates}
            tables={tables}
            eventId={eventDisplayData.id}
          />
          <EventGuests event={eventDisplayData} />
          <PastHighlights
            event={event}
            previousHighlights={highlightPictures}
          />
        </div>
      </div>
      <Blurred posterUrl={eventDisplayData.publicPosterUrl} />
    </div>
  );
}
