import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Tables } from "@/types/supabase";
import { getPublicPosterUrl } from "@/lib/helpers/events";
import { getPublicVenueMapUrl } from "@/lib/helpers/events";
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
import { EventWithDates } from "@/types/event";

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
  const publicPosterUrl = await getPublicPosterUrl(event);
  const publicVenueMapUrl = await getPublicVenueMapUrl(event);

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
              <Tags event={event} />
              <EventInfo event={event} />
            </div>
            <div className="my-8 md:my-12 space-y-8 rounded-2xl border-[1px] border-foreground/10 bg-slate-500/10 bg-opacity-20 py-5 px-6 z-10">
              <Tickets event={event} eventDisplayData={eventDisplayData} />
              <VendorTables event={event} />
            </div>
          </div>
          <About event={event} />
          <Guests event={event} />
          <Vendors event={event} />
          <VenueMap event={event} venueMapPublicUrl={publicVenueMapUrl} />
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
