import { getEventDisplayData } from "@/lib/helpers/events";
import { validateUser } from "@/lib/actions/auth";
import { Separator } from "@/components/ui/separator";
import { Tables } from "@/types/supabase";
import Location from "./sections/Location";
import Tickets from "./tickets/Tickets";
import Tags from "./Tags";
import VendorTables from "./tables/VendorTables";
import HostedBy from "./sections/HostedBy";
import Vendors from "./sections/Vendors";
import EventOptions from "./options/EventOptions";
import EventHeading from "./sections/EventHeading";
import About from "./sections/About";
import Poster from "./sections/Poster";
import VenueMap from "./sections/VenueMap";

export default async function EventPage({
  event,
  vendors,
}: {
  event: Tables<"events">;
  vendors: Tables<"profiles">[];
}) {
  const {
    data: { user },
  } = await validateUser();
  const eventDisplayData = await getEventDisplayData(event);

  return (
    <main className="w-full md:max-w-[1400px] m-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:space-x-14 w-full">
        <Poster event={event} user={user} />
        <div className="text-left w-full max-w-xl md:max-w-2xl mx-auto space-y-8">
          <EventHeading event={event} />
          <Tags event={event} />
          <div className="space-y-2">
            <Tickets event={event} eventDisplayData={eventDisplayData} />
            <VendorTables event={event} />
          </div>
          <Separator />
          <About event={event} />
          <Separator />
          <Location event={event} />
          <Separator />
          <Vendors vendors={vendors} />
          <HostedBy event={event} />
          <VenueMap event={event} />
        </div>
      </div>
      <EventOptions event={event} user={user} />
    </main>
  );
}
