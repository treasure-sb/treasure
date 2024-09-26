import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getPublicVenueMapUrl } from "@/lib/helpers/events";
import { EventWithDates } from "@/types/event";
import { TagData } from "../types";
import Tickets from "./tickets/Tickets";
import Tags from "./Tags";
import VendorTables from "./tables/VendorTables";
import HostedBy from "./hosts/HostedBy";
import Vendors from "./vendors/Vendors";
import EventOptions from "./options/EventOptions";
import EventInfo from "./sections/EventInfo";
import About from "./sections/About";
import Poster from "./sections/Poster";
import Blurred from "./Blurred";
import Guests from "./sections/Guests";
import PastHighlights from "./past_highlights/PastHighlights";
import VenueMap from "./sections/VenueMap";
import createSupabaseServerClient from "@/utils/supabase/server";
import Footer from "@/components/shared/Footer";

export default async function EventPage({ event }: { event: EventWithDates }) {
  const {
    data: { user },
  } = await validateUser();
  const supabase = await createSupabaseServerClient();

  const { error: viewError } = await supabase
    .from("event_views")
    .insert([{ event_id: event.id, visitor_id: user?.id }]);

  if (viewError) {
    console.error(viewError);
  }

  const eventDisplayData = await getEventDisplayData(event);
  const publicPosterUrl = await getPublicPosterUrl(event.poster_url);
  const publicVenueMapUrl = await getPublicVenueMapUrl(event.venue_map_url);

  const { data: tagsData } = await supabase
    .from("event_tags")
    .select("tags(*)")
    .eq("event_id", event.id)
    .returns<TagData[]>();

  const tags: TagData[] = tagsData || [];
  const cleanedTags = tags.map((tag) => tag.tags);

  return (
    <main className="relative">
      <div className="md:max-w-[1160px] m-auto flex flex-col md:flex-row md:justify-between md:space-x-14">
        <Poster event={event} user={user} />
        <div className="text-left w-full max-w-xl md:max-w-2xl mx-auto relative z-20 space-y-3">
          <div className="mb-8 md:mb-12">
            <div className="space-y-4 md:space-y-5">
              <h1 className="text-4xl md:text-5xl font-semibold">
                {event.name}
              </h1>
              <Tags tags={cleanedTags} />
              <EventInfo
                dates={event.dates}
                address={event.address}
                venueName={event.venue_name}
              />
            </div>
            <div className="my-8 md:my-12 space-y-8 rounded-2xl border-[1px] border-foreground/10 bg-slate-500/10 bg-opacity-20 py-5 px-6 z-10">
              <Tickets event={event} eventDisplayData={eventDisplayData} />
              <VendorTables event={event} />
            </div>
          </div>
          <About description={event.description} />
          <Guests event={event} />
          <Vendors event={event} />
          <VenueMap
            venueMap={event.venue_map_url}
            venueMapPublicUrl={publicVenueMapUrl}
          />
          <PastHighlights event={event} />
          <HostedBy event={event} />
        </div>
      </div>
      <Blurred posterUrl={publicPosterUrl} />
      <EventOptions event={event} user={user} />
      <div className="mt-6 md:mt-20">
        <Footer isEventPage={true} />
      </div>
    </main>
  );
}
